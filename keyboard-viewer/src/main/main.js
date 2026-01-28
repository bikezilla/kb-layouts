const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#1a1a2e'
  });

  win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

// Load keyboard layout files
ipcMain.handle('load-layouts', async () => {
  // Use absolute path to the layouts directory
  const layoutsDir = '/Users/bikezilla/code/personal/kb-layouts';

  const layouts = {};

  try {
    const eloraPath = path.join(layoutsDir, 'elora.vil');
    layouts.elora = JSON.parse(fs.readFileSync(eloraPath, 'utf8'));
  } catch (e) {
    console.error('Error loading elora.vil:', e);
  }

  try {
    const cornePath = path.join(layoutsDir, 'corne-v4.vil');
    layouts.corne = JSON.parse(fs.readFileSync(cornePath, 'utf8'));
  } catch (e) {
    console.error('Error loading corne-v4.vil:', e);
  }

  return layouts;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
