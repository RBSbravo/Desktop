// Placeholder for Electron preload/renderer logic 
const { app, BrowserWindow, Menu } = require('electron');

app.on('ready', () => {
  Menu.setApplicationMenu(null);
}); 