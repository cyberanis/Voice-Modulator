const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");

let win = null;
let cpp = null;
let output_path = null;

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

function stopCppProcess() {
  if (cpp) {
    cpp.stdin.write("stop\n");
    cpp = null;
  }
  // cpp.stdout.on("data", (data) => {
  //   const str = data.toString();

  //   const output = data.toString().trim();
  //   if (output.endsWith(".wav")) {
  //   }
  //     lastTempWavPath = output;
  // });
}

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

app.on("before-quit", () => {
  if (cpp) cpp.kill();
});

console.log("------WINDOW CREATED---------");
app.whenReady().then(createWindow);

ipcMain.on("start-cpp", (event, args) => {
  /**@type string */
  let speed = String(args.speed);
  let pitch = String(args.pitch);
  let reverb = String(args.reverb);
  let effect = String(args.effect);

  output_path = app.getPath("temp");
  output_path += "\\output";

  /**@type string[] */
  let parsedArgs = [];
  if (args) {
    parsedArgs = [speed, pitch, reverb, effect, output_path];
  }
  console.log(parsedArgs);

  console.log("---------CPP STARTED---------");
  startCppProcess(parsedArgs); // J'envoie ça sous forme de tableau
});
ipcMain.on("stop-cpp", () => {
  console.log("---------CPP STOPPED---------");
  stopCppProcess();
});

ipcMain.on("read-file", (event, config) => {
  if (config.effect == "R") {
    output_path += "Robotised";
  }
  if (config.reverb != 0) {
    output_path += "Reverbed";
  }
  output_path += ".wav";

  console.log(output_path);
  if (fs.existsSync(output_path)) {
    exec(`start ${output_path}`, (err) => {
      if (err) console.error(err);
      else console.log("Lecture WAV lancée avec l’application par défaut");
    });
  } else {
    console.log("Fichier .wav introuvable !");
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
