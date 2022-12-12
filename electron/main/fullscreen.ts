import { BrowserWindow, ipcMain } from "electron";
import axios from "axios";

export function initFullscreen(win: BrowserWindow | null) {
  ipcMain.handle("is-full-screen", async (event, ...args) => {
    return win.isFullScreen();
  });

  ipcMain.handle("set-full-screen", async (event, ...args) => {
    return win.setFullScreen(!!args[0]);
  });
}
