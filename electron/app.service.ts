import { Injectable } from '@nestjs/common';
import {app, BrowserWindow, screen} from 'electron';
import * as url from "url";
import * as path from "path";
import {GetApp} from "./nestjs";

let waited = false;

@Injectable()
export class AppService {

  constructor(
  ) {
  }

  private _window: BrowserWindow;
  private isServing = false;

  start(isServing: boolean) {
    this.isServing = isServing;

    app.allowRendererProcessReuse = true;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More details at https://github.com/electron/electron/issues/15947
    app.on('ready', () => setTimeout(() => this.createWindow(), 400));

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      console.log('DO SOMETHING!');
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', async (event) => {
      if (waited) {
        return;
      }
      event.preventDefault();

      await GetApp().close();
      waited = true;
      app.quit();
    })

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (!this._window) {
        this.createWindow()
      }
    });
  }

  createWindow(): BrowserWindow {

    if (this._window) {
      return this._window;
    }

    const size = screen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    const win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: this.isServing,
      },
    });

    if (this.isServing) {

      require('devtron').install();
      win.webContents.openDevTools();

      require('electron-reload')(__dirname, {
        electron: __non_webpack_require__(`${__dirname}/node_modules/electron`),
        argv: process.argv.slice(1)
      });
      win.loadURL('http://localhost:4200');

    } else {
      win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }

    // Emitted when the window is closed.
    win.on('closed', (event) => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this._window = null;
    });

    this._window = win;

    return win;
  }


  get window(): Electron.BrowserWindow {
    return this._window;
  }
}
