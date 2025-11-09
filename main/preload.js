const { contextBridge, ipcRenderer } = require("electron");

// Expose safe Electron APIs to renderer process via window.electronAPI
contextBridge.exposeInMainWorld("electronAPI", {
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
});

