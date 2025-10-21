const { contextBridge } = require("electron");
const fs = require("fs");

contextBridge.exposeInMainWorld("electronAPI", {
  // Fonction accessible depuis React
  getAudioBuffer: async (path) => {
    try {
      const data = await fs.promises.readFile(path);
      return data; // c’est un Buffer Node.js
    } catch (err) {
      console.error("Erreur preload:", err);
      return null;
    }
  },
});
