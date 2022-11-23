const {app, BrowserWindow, Menu} = require('electron');
// 区分环境
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const Store = require('electron-store');
const menuTemp = require('./src/temp/menuTemp');

Store.initRenderer();
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
  mainWin.webContents.openDevTools();
  // 添加自定义原生菜单
  const menu = Menu.buildFromTemplate(menuTemp);
  Menu.setApplicationMenu(menu);
  const urlLocation = isDev ? 'http://localhost:3000' : 'myUrl';
  mainWin.loadURL(urlLocation);
  // mainWin.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, './index.html'), // 修改这里
  //     protocol: 'file:',
  //     slashes: true
  //   })
  // );
  require('@electron/remote/main').initialize();
  require('@electron/remote/main').enable(mainWin.webContents);
});
