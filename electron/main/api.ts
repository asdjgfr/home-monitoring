import { ipcMain } from "electron";
import axios from "axios";

export function initApi() {
  const instance = axios.create({
    timeout: 3000,
  });

  ipcMain.handle("get", async (event, ...args) => {
    return (await instance.get(args[0], args[1])).data;
  });

  ipcMain.handle("post", async (event, ...args) => {
    return (await instance.post(args[0], args[1])).data;
  });
}
