const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 420,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e',
    resizable: true,
    alwaysOnTop: false
  });

  mainWindow.loadFile('renderer/index.html');
}

// Load .vil files
ipcMain.handle('load-layouts', async () => {
  const layoutsDir = path.join(__dirname, '..');
  const layouts = {};

  const files = ['elora.vil', 'corne-v4.vil'];
  for (const file of files) {
    const filePath = path.join(layoutsDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const name = file.replace('.vil', '').replace('-v4', '');
      layouts[name] = JSON.parse(content);
    }
  }
  return layouts;
});

ipcMain.handle('toggle-always-on-top', async () => {
  const current = mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(!current);
  return !current;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
