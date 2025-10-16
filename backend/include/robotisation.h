#ifndef ROBOTISATION_H
#define ROBOTISATION_H

#include <iostream>
#include <vector>
#include <cmath>


class Robotisation {
  public:
    void robotisation(std::vector<float>& samples, std::size_t N);
    std::vector<float> split_and_robotise(std::vector<std::vector<float>>& splitted_signal);
};

#endif
