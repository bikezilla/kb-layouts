const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadLayouts: () => ipcRenderer.invoke('load-layouts'),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top')
});
