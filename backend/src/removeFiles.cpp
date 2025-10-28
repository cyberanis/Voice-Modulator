#include <iostream>
#include <string>
#include <filesystem>
using namespace std;

int main(int nb, char * argv[]){
  if (nb == 2){
    string path = argv[1];
    if (filesystem::exists(path)){
      filesystem::remove(path);
      cout << "fichier supprimé \r\n";
    }
    else{
      cout << "ficher inexistant \r\n";
    }
  }
  else{
    cout << "Aucun chemin inséré";
  }
}
