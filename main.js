const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let currentChild = null; // Track running child process for cancellation

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#121212',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools(); // Uncomment for debugging
}

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

// IPC: Select File Dialog
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'IMF IAB', extensions: ['mxf'] }],
  });
  if (canceled) { return; }
  return filePaths[0];
});

// IPC: Save File Dialog (for Output)
ipcMain.handle('dialog:saveFile', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'DCP IAB', extensions: ['mxf'] }],
  });
  if (canceled) { return; }
  return filePath;
});

// IPC: Run CineIA Command
ipcMain.on('run-cineia', (event, args) => {
  const { inputPath, outputPath, options, cineiaPath } = args;

  // Construct command arguments
  const cmdArgs = [];

  if (options.noCopyPreamble) cmdArgs.push('-n');
  if (options.forceDolby) cmdArgs.push('-f');
  if (options.channels) {
    const ch = parseInt(options.channels, 10);
    if (isNaN(ch) || ch < 1 || ch > 256) {
      event.reply('cineia-output', 'Error: Invalid channel count (must be 1-256).\n');
      event.reply('cineia-exit', -1);
      return;
    }
    cmdArgs.push('-c');
    cmdArgs.push(String(ch));
  }
  if (options.objects) {
    const obj = parseInt(options.objects, 10);
    if (isNaN(obj) || obj < 1 || obj > 256) {
      event.reply('cineia-output', 'Error: Invalid object count (must be 1-256).\n');
      event.reply('cineia-exit', -1);
      return;
    }
    cmdArgs.push('-o');
    cmdArgs.push(String(obj));
  }

  cmdArgs.push(inputPath);
  cmdArgs.push(outputPath);

  // Use custom path if provided, else check bundled binary, else default to 'cineia'
  let command = cineiaPath;

  if (!command) {
    const platform = process.platform;
    const isWin = platform === 'win32';
    const binaryName = isWin ? 'cineia.exe' : 'cineia';

    if (app.isPackaged) {
      // In production, binaries are copied to Resources/bin (flattened by builder)
      command = path.join(process.resourcesPath, 'bin', binaryName);
    } else {
      // In development, detect platform folder: bin/mac or bin/win
      const platformDir = isWin ? 'win' : 'mac';
      const bundledPath = path.join(__dirname, 'bin', platformDir, binaryName);
      const fs = require('fs');

      if (fs.existsSync(bundledPath)) {
        command = bundledPath;
      } else {
        command = binaryName;
      }
    }
  }

  event.reply('cineia-output', `Running: ${command} ${cmdArgs.join(' ')}\n`);

  try {
    currentChild = spawn(command, cmdArgs);
    const child = currentChild;

    child.stdout.on('data', (data) => {
      event.reply('cineia-output', data.toString());
    });

    child.stderr.on('data', (data) => {
      event.reply('cineia-output', `Error: ${data.toString()}`);
    });

    child.on('error', (err) => {
      currentChild = null;
      if (err.code === 'ENOENT') {
        event.reply('cineia-output', `CRITICAL ERROR: Could not find '${command}' executable.\nPlease explicitly set the CineIA Path in Settings.\n`);
      } else {
        event.reply('cineia-output', `CRITICAL ERROR: Failed to start process: ${err.message}\n`);
      }
      event.reply('cineia-exit', -1);
    });

    child.on('close', (code) => {
      currentChild = null;
      event.reply('cineia-exit', code);
    });
  } catch (e) {
    event.reply('cineia-output', `Exception: ${e.message}\n`);
    event.reply('cineia-exit', -1);
  }
});

// IPC: Cancel running CineIA process
ipcMain.on('cancel-cineia', (event) => {
  if (currentChild) {
    currentChild.kill('SIGTERM');
    currentChild = null;
    event.reply('cineia-output', 'Cancelled by user.\n');
    event.reply('cineia-exit', -999);
  }
});
