// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import type { ScreenSaverLaunchConfig } from "./types";

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  maximizeWindow: () => ipcRenderer.send("window-maximize"),
  closeWindow: () => ipcRenderer.send("window-close"),
  openScreenSaverWindow: (config: ScreenSaverLaunchConfig) =>
    ipcRenderer.send("open-screen-saver-window", config),

  isWindowMaximized: () => ipcRenderer.invoke("get-window-maximized-state"),

  onMaximizeStateChange: (callback: (isMaximized: boolean) => void) => {
    const handleMaximize = () => callback(true);
    const handleUnmaximize = () => callback(false);

    ipcRenderer.on("window-is-maximized", handleMaximize);
    ipcRenderer.on("window-is-unmaximized", handleUnmaximize);

    return () => {
      ipcRenderer.removeListener("window-is-maximized", handleMaximize);
      ipcRenderer.removeListener("window-is-unmaximized", handleUnmaximize);
    };
  },

  getClockFormat: () => ipcRenderer.invoke("get-clock-format"),
  setClockFormat: (format: "12h" | "24h") =>
    ipcRenderer.send("set-clock-format", format),

  saveUploadedFile: (fileBuffer: ArrayBuffer, fileName: string) =>
    ipcRenderer.invoke("save-uploaded-file", fileBuffer, fileName),
  getSavedWallpapers: () => ipcRenderer.invoke("get-saved-wallpapers"),
  deleteSavedWallpaper: (fileUrlOrName: string) =>
    ipcRenderer.invoke("delete-saved-wallpaper", fileUrlOrName),
});
