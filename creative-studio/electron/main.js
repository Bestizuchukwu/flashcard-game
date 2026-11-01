const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = !app.isPackaged;
let nextServer = null;
let splashWindow = null;
let mainWindow = null;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 520,
    height: 340,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    backgroundColor: "#050b16",
    center: true,
    show: true,
  });

  const svg = `
    <svg width="520" height="340" viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0b1020"/>
          <stop offset="50%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#090f1f"/>
        </linearGradient>
        <linearGradient id="logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="35%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#8b5cf6"/>
        </linearGradient>
      </defs>
      <rect width="520" height="340" rx="28" fill="url(#bg)"/>
      <rect x="16" y="16" width="488" height="308" rx="24" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)"/>
      <g transform="translate(196 88)">
        <rect x="0" y="0" width="128" height="128" rx="30" fill="url(#logo)"/>
        <path d="M36 96L64 26L92 96H76L69 81H59L52 96H36ZM60 49L56 64H64L60 49Z" fill="white"/>
      </g>
      <text x="260" y="255" text-anchor="middle" fill="#e2e8f0" font-size="26" font-family="Arial, Helvetica, sans-serif" font-weight="700">Astera Studio</text>
      <text x="260" y="286" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial, Helvetica, sans-serif" letter-spacing="3">PREPARING WORKSPACE</text>
    </svg>
  `;

  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
    <html>
      <body style="margin:0;background:transparent;display:flex;align-items:center;justify-content:center;font-family:Arial,Helvetica,sans-serif;">
        <div style="background:transparent;display:flex;align-items:center;justify-content:center;width:100vw;height:100vh;">
          <img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}" style="width:520px;height:340px;border-radius:28px;display:block;" />
        </div>
      </body>
    </html>
  `)}`);
}

function startNextServer() {
  if (isDev) return;

  const appRoot = path.join(__dirname, "..");
  const nextBin = path.join(
    appRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "next.cmd" : "next"
  );

  nextServer = spawn(nextBin, ["start", "-p", "3000"], {
    cwd: appRoot,
    shell: true,
    stdio: "inherit",
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1560,
    height: 980,
    minWidth: 1200,
    minHeight: 780,
    backgroundColor: "#050b16",
    title: "Astera Studio",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    frame: true,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close();
        splashWindow = null;
      }
      mainWindow.show();
    }, 1200);
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createSplashWindow();

  if (!isDev) {
    startNextServer();
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
