#include "../include/signal.h"
#include <vector>

using namespace std;


vector<vector<float>> Signal::chunk_vector(size_t chunk_size){
    // this function splits the initial vector "samples" into a vector of vectors by taking each time sets of "chunk_size" vectors
    vector<float> samples = this->signal;
    vector<vector<float>> chunks;
    for (size_t i=0; i<samples.size(); i+=chunk_size){  
        size_t end = min(samples.size(), i+chunk_size); 
        chunks.emplace_back(samples.begin()+i, samples.begin()+end);
    };
    return chunks;
};


void Signal::reverb(int Intensite, float gain){
    vector<float> buffer = this->signal;
    vector<float> retards;
    for (int i = 0; i < Intensite; i ++){
        int retard = 4410 * (i+1);
        retards.push_back(retard);
    }

    for (int i = 0; i < buffer.size(); i ++){
        for (int j = 0; j < retards.size(); j ++){
            if(i > retards[j]){
                buffer[i] += (gain/(j+1))*buffer[i-retards[j]];
            }
        }
    }

    this->signal = buffer;
}


