#include <iostream>
#include <vector>
#include <cmath>
#include <thread>
#include <string>
#include <fstream>
#include <cstdint>
#include "D:/Dev Projects/librairies/Cpp/portaudio/include/portaudio.h"
#include "../include/robotisation.h"
#include "../include/signal.h"

using namespace std;



#define NumSeconds 10
#define Rate 44100.0
#define FramesPerBuffer 256





void writeWav(const string& filename, const vector<float>& buffer, int sampleRate) {
    ofstream out(filename, ios::binary);

    int32_t subchunk2Size = buffer.size() * 2; // 16-bit = 2 bytes par sample
    int32_t chunkSize = 36 + subchunk2Size;

    // --- RIFF Header ---
    out.write("RIFF", 4);
    out.write(reinterpret_cast<const char*>(&chunkSize), 4);
    out.write("WAVE", 4);

    // --- fmt chunk ---
    out.write("fmt ", 4);
    int32_t subchunk1Size = 16;
    int16_t audioFormat = 1;      // PCM
    int16_t numChannels = 1;      // mono
    int32_t byteRate = sampleRate * numChannels * 2;
    int16_t blockAlign = numChannels * 2;
    int16_t bitsPerSample = 16;

    out.write(reinterpret_cast<const char*>(&subchunk1Size), 4);
    out.write(reinterpret_cast<const char*>(&audioFormat), 2);
    out.write(reinterpret_cast<const char*>(&numChannels), 2);
    out.write(reinterpret_cast<const char*>(&sampleRate), 4);
    out.write(reinterpret_cast<const char*>(&byteRate), 4);
    out.write(reinterpret_cast<const char*>(&blockAlign), 2);
    out.write(reinterpret_cast<const char*>(&bitsPerSample), 2);

    // --- data chunk ---
    out.write("data", 4);
    out.write(reinterpret_cast<const char*>(&subchunk2Size), 4);

    // Convert float [-1.0,1.0] -> int16_t [-32768,32767]
    for (float sample : buffer) {
        int16_t s = static_cast<int16_t>(max(-1.0f, min(1.0f, sample)) * 32767);
        out.write(reinterpret_cast<const char*>(&s), 2);
    }

    out.close();
    cout << "Fichier WAV écrit : " << filename << endl;
}



void segAndComputeRMS(vector<vector<float>>* chunk_buffer, int frames){
    for(vector<float> buf : *chunk_buffer){
        float sum = 0.0;
        for(float i : buf){
            sum += i*i;
        }
        cout << sqrt(sum/frames) << endl;
    }
}

static int audioCallback(const void* inputBuffer,
                         void* outputBuffer,
                         unsigned long framesPerBuffer,
                         const PaStreamCallbackTimeInfo* timeInfo,
                         PaStreamCallbackFlags statusFlags,
                         void* userData
                         ) 
{
    const float* in = (const float*)inputBuffer;
    Signal* buffer = (Signal*)userData;
    if (in == nullptr) return paContinue;


    // Exemple : calcul RMS du buffer en temps réel
    double sumSquares = 0.0;
    for (unsigned long i = 0; i < framesPerBuffer; i++) {
        buffer->signal.push_back(in[i]);
        sumSquares += in[i] * in[i];
    }
    float rms = sqrt(sumSquares / framesPerBuffer);

    // Ici tu peux soit l’afficher, soit l’envoyer à Electron via stdout
    cout << rms << endl;

    return paContinue; // continue le stream
}


int main(int argc, char* argv[]) {
    bool stopFlag = false;
    int speed = 1;
    int pitch = 1;
    int rev = 0;
    char effect = 'R';
   
    if (argc != 1){
        speed = stoi(argv[1]);
        pitch = stoi(argv[2]);
        rev = stoi(argv[3]);
        effect = argv[4][0];
    }
        
    
    PaError err;
    err = Pa_Initialize();
    if (err != paNoError) return -1;

    Signal buffer;

    PaStream *stream;

    
    err = Pa_OpenDefaultStream(&stream,
                            1,                // entrée micro
                            0,                // sortie (none)
                            paFloat32,        // format
                            Rate,             // fréquence
                            FramesPerBuffer,  // taille buffer
                            audioCallback,    // ta fonction de traitement
                            &buffer);         // userData
    if (err != paNoError) return -1;
    
    err = Pa_StartStream(stream);
    if (err != paNoError) return -1;

    
    
    while (Pa_IsStreamActive(stream) && !stopFlag) {
        string line;
        if(getline(cin, line)){
            if(line == "stop") stopFlag = true;
        }
        Pa_Sleep(100); // 100ms → CPU ne sature pas
    }

    
    Pa_StopStream(stream);
    Pa_CloseStream(stream);

    string path = "../../outputs/output";
    if(effect == 'R'){
        Robotisation Robot;
        vector<vector<float>> splitted_signal = buffer.chunk_vector(1024);
        buffer.signal = Robot.split_and_robotise(splitted_signal);
        path += "Robotised";
    }
    else if(effect == 'A'){
        path += "Alienified";
    }
    else if(effect == 'O'){
        path += "Other";
    }


    if (speed != 1);
    if(pitch != 1);
    if(rev != 0){
        buffer.reverb(rev, 0.5);
        path += "Reverbed";
    }

    path += ".wav";
    writeWav(path, buffer.signal, 44100);

    cout << path << endl;
    Pa_Terminate();

    return 0;
}