const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let win = null;
let cpp = null;

function nameformation(parsedArgs) {
  const basePath = path.join(__dirname, "../../outputs"); // module path, pas masqué !
  let fileName = "output";

  if (parsedArgs[3] === "R") fileName += "Robotised";
  if (parsedArgs[2] !== 0) fileName += "Reverbed";
  if (fileName === "") fileName = "output"; // fichier par défaut

  const fullPath = path.resolve(basePath, `${fileName}.wav`);
  const fileURL = `file:///${fullPath.replace(/\\/g, "/")}`; // compatible Windows/macOS/Linux

  console.log("🔊 Fichier audio :", fileURL);
  return fileURL;
}

function startCppProcess(config) {
  cpp = spawn("../../backend/build/test.exe", config);
  console.log(config);

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
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 700,
    resizable: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
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

  /**@type string[] */
  let parsedArgs = [];
  if (args) {
    parsedArgs = [speed, pitch, reverb, effect];
  }

  const path = nameformation(parsedArgs);

  win.webContents.send("fileName", path);

  console.log("---------CPP STARTED---------");
  startCppProcess(parsedArgs); // J'envoie ça sous forme de tableau
});
ipcMain.on("stop-cpp", () => {
  console.log("---------CPP STOPPED---------");
  stopCppProcess();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
