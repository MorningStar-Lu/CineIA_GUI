const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectInputFile: () => ipcRenderer.invoke('dialog:openFile'),
    selectOutputFile: () => ipcRenderer.invoke('dialog:saveFile'),
    runCineia: (args) => ipcRenderer.send('run-cineia', args),
    onCineiaOutput: (callback) => ipcRenderer.on('cineia-output', (_event, value) => callback(value)),
    onCineiaExit: (callback) => ipcRenderer.on('cineia-exit', (_event, code) => callback(code)),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
