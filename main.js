const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === '1';

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Ticketing and Task Management System',
    icon: app.isPackaged 
      ? path.join(process.resourcesPath, 'app', 'icons', 'desktop_logo.png')
      : path.join(__dirname, 'icons', 'desktop_logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
    show: false, // Don't show until ready
  });

  // Load the app
  if (isDev) {
    win.loadURL('http://localhost:3001');
    // Open the DevTools.
    win.webContents.openDevTools();
    win.show();
  } else {
    // In production, load from the packaged build folder
    // Fix: Use proper path resolution for packaged app
    let indexPath;
    if (app.isPackaged) {
      // When packaged, the app is in resources/app/
      indexPath = path.join(process.resourcesPath, 'app', 'build', 'index.html');
    } else {
      // When running from source
      indexPath = path.join(__dirname, 'build', 'index.html');
    }
    
    console.log('Loading from:', indexPath);
    console.log('App is packaged:', app.isPackaged);
    console.log('Resources path:', process.resourcesPath);
    
    // Enable DevTools for debugging (only in development)
    if (isDev) {
      win.webContents.openDevTools();
    }
    
    // Add error handling for the webContents
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    });
    
    win.webContents.on('did-finish-load', () => {
      console.log('Page finished loading');
      // Inject a script to ensure proper rendering
      win.webContents.executeJavaScript(`
        console.log('Document ready state:', document.readyState);
        console.log('Document mode:', document.compatMode);
        if (document.compatMode === 'BackCompat') {
          console.warn('Document is in Quirks Mode!');
        }
      `);
    });
    
    win.webContents.on('dom-ready', () => {
      console.log('DOM is ready');
    });
    
    win.loadFile(indexPath).then(() => {
      console.log('File loaded successfully');
      win.show();
    }).catch((error) => {
      console.error('Error loading file:', error);
      win.show();
    });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  Menu.setApplicationMenu(null); // Remove the menu bar
  createWindow();
});

// Quit when all windows are closed.
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

// Handle IPC messages here if needed 