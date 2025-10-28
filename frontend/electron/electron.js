const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");

let win = null;
let cpp = null;
let output_path = null; //C'est la variable qui gère le chemin vers le fichier .wav

// fonction permettant de lancer l'enregistrement
function startCppProcess(config) {
  cpp = spawn("../../backend/build/test.exe", config);

  cpp.stdout.on("data", (data) => {
    const str = data.toString();

    const values = str
      .split(/\r?\n/) // découpe par CRLF ou LF
      .filter((line) => line.trim() !== "")
      .map((line) => parseFloat(line))
      .filter((num) => !isNaN(num));

    win.webContents.send("cpp-data", values);
  });
}

// Fonction permettant d'arreter l'enregistrement
function stopCppProcess() {
  if (cpp) {
    cpp.stdin.write("stop\n");
    cpp = null;
  }
}

// fonction permettant de créer la fenetre
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 700,
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Détecte si on est en dev ou prod
  const isDev = !app.isPackaged;

  const startUrl = isDev
    ? "http://localhost:5173" // URL du serveur Vite en dev
    : `file://${path.join(__dirname, "../react/dist/index.html")}`; // build

  win.loadURL(startUrl);

  win.on("closed", () => {
    console.log("Fenêtre détruite");
    win = null;
  });

  if (isDev) {
    win.webContents.openDevTools(); // DevTools en dev
  }
}

// permet la confection du chemin vers le fichier d'enregistrement de l'audio
function confection_path(config) {
  output_path = app.getPath("temp");
  output_path += "\\output";

  if (config.effect == "R") {
    output_path += "Robotised";
  }
  if (config.reverb != 0) {
    output_path += "Reverbed";
  }
  output_path += ".wav";
}

// permet de shutdown le programme
app.on("before-quit", () => {
  if (cpp) cpp.kill();
});

console.log("------WINDOW CREATED---------");
app.whenReady().then(createWindow); // permet de lancer la fenetre

// recoit l'instruction depuis le renderer par IPCRenderer pour lancer la fonction d'enregistrement
ipcMain.on("start-cpp", (event, args) => {
  /**@type string */
  let speed = String(args.speed);
  let pitch = String(args.pitch);
  let reverb = String(args.reverb);
  let effect = String(args.effect);

  //supprime le fichier precedent non enregistré avant de passer au prochain
  if (output_path != null) {
    const oldpath = output_path;
    const cpp = spawn("../../backend/build/remove.exe", [oldpath]);
  }

  confection_path(args);

  /**@type string[] */
  let parsedArgs = [];
  if (args) {
    parsedArgs = [speed, pitch, reverb, effect, output_path];
  }
  console.log(parsedArgs);

  console.log("---------CPP STARTED---------");
  startCppProcess(parsedArgs); // J'envoie ça sous forme de tableau
});

// arrete l'enregistrement sous l'instruction du renderer
ipcMain.on("stop-cpp", () => {
  console.log("---------CPP STOPPED---------");
  stopCppProcess();
});

// permet de lire l'enregistrement
ipcMain.on("read-file", (event, config) => {
  if (fs.existsSync(output_path)) {
    exec(`start ${output_path}`, (err) => {
      if (err) console.error(err);
      else console.log("Lecture WAV lancée avec l’application par défaut");
    });
  } else {
    console.log("Fichier .wav introuvable !");
  }
});

ipcMain.on("save-temp-file", (event)=>{
  try{

    if (! fs.existsSync(output_path)){ // si le fichier n'existe pas
      throw new Error("le fichier " + output_path + "n'existe pas !")
    }

    const {canceled, filepath} = await dialog.showSaveDialog({ // canceled = false si l'utilisateur choisi un chemin 
      // filepath est le chemin choisi pour l'enregistrement
      title: "Enregistrement",
      defaultPath: "output.wav",
      filters: [{name: "fichiers audios", extensions: ["wav"]}]
    })

    if (canceled || !filepath){
      return {success: false, message: "Enregistrement annulé"}
    }


    fs.copyFileSync(output_path, filepath);
  }
  catch(error){
    console.log("erreur lors de la sauvegarde :", error);
    return {success:false, message: error.message};
  }
})


ipcMain.on("save-temp-file", (event)=>{
  try{

    if (! fs.existsSync(output_path)){ // si le fichier n'existe pas
      throw new Error("le fichier " + output_path + "n'existe pas !")
    }

    const {canceled, filepath} = await dialog.showSaveDialog({ // canceled = false si l'utilisateur choisi un chemin 
      // filepath est le chemin choisi pour l'enregistrement
      title: "Enregistrement",
      defaultPath: "output.wav",
      filters: [{name: "fichiers audios", extensions: ["wav"]}]
    })

    if (canceled || !filepath){
      return {success: false, message: "Enregistrement annulé"}
    }


    fs.copyFileSync(output_path, filepath);
  }
  catch(error){
    console.log("erreur lors de la sauvegarde :", error);
    return {success:false, message: error.message};
  }
})


// permet de fermer tous les processus après la fermeture de la fenetre
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
