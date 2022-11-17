const {app, BrowserWindow} = require('electron');
// 区分环境
const isDev = require('electron-is-dev');
let mainWin = null;
app.on('ready', () => {
  mainWin = new BrowserWindow({
    width: 1024,
    height: 650,
    minWidth: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  const urlLocation = isDev ? 'http://localhost:3000' : 'myUrl';
  mainWin.loadURL(urlLocation);
});
