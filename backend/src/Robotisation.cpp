#include "../include/robotisation.h"
#include <vector>
#include <cmath>
#include "D:/Dev Projects/librairies/Cpp/kissfft/kiss_fft.h"

using namespace std;


void Robotisation::robotisation(vector<float>& samples, size_t N){
    // this function robotises the sample by removing all the phase of the fourier transformation
    // N taille FFT (bon compromis entre rapidité et efficacité)

    vector<kiss_fft_cpx> in(N);
    vector<kiss_fft_cpx> out(N);

    for (size_t k=0; k<N; k++){ 
        in[k].r = samples[k];
        in[k].i = 0.0f;

    };

    kiss_fft_cfg cfg = kiss_fft_alloc(N, 0, nullptr, nullptr);

    kiss_fft(cfg, in.data(), out.data());

    float max_amp = 0.0;

    for (size_t k = 0; k<N; k++){
        float real = out[k].r;
        float img = out[k].i;
        float amplitude = sqrt(real*real + img*img);
        if (amplitude > max_amp){
            max_amp = amplitude;
        };
    }

    for (size_t k=0; k<N; k++){ 
        float real = out[k].r;
        float img = out[k].i;

        float amplitude = sqrt(real*real + img*img);
        
        out[k].r = (amplitude > (0.1 * max_amp)) ? amplitude : 0.0;
        out[k].i = 0.0;
    }

    kiss_fft_cfg ifft_cfg = kiss_fft_alloc(N, 1, nullptr, nullptr);
    kiss_fft(ifft_cfg, out.data(), in.data());

    for(size_t k = 0; k < N; k++){  
        samples[k] = in[k].r / N; // diviser par N après IFFT
    };

    free(cfg);
    free(ifft_cfg);

}
vector<float> Robotisation::split_and_robotise(vector<vector<float>>& splitted_signal) {
    vector<float> assembled_sample;

    for (size_t i = 0; i < splitted_signal.size(); i++) {
        // Appliquer la robotisation sur chaque sous-vecteur
        robotisation(splitted_signal[i], splitted_signal[i].size());

        // Ajouter le résultat au vecteur final
        const vector<float>& robotised_sample = splitted_signal[i];
        assembled_sample.insert(assembled_sample.end(), robotised_sample.begin(), robotised_sample.end());
    }

    return assembled_sample;
}
