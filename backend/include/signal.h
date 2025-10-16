#ifndef SIGNAL_H
#define SIGNAL_H

#include <vector>

class Signal {
  public:
    int samplesNumber;
    std::vector<float> signal;
    Signal() : samplesNumber(0), signal() {}
    Signal(int n) : samplesNumber(n), signal(n) {}

    std::vector<std::vector<float>> chunk_vector(std::size_t chunk_size);
    void reverb(int Intensite, float gain);
};



#endif 