// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  maximizeWindow: () => ipcRenderer.send("window-maximize"),
  closeWindow: () => ipcRenderer.send("window-close"),

  isWindowMaximized: () => ipcRenderer.invoke("get-window-maximized-state"),

  onMaximizeStateChange: (callback: (isMaximized: boolean) => void) => {
    const handleMaximize = (event: IpcRendererEvent, isMaximized: boolean) =>
      callback(isMaximized);

    ipcRenderer.on("window-is-maximized", handleMaximize);
    ipcRenderer.on("window-is-unmaximized", handleMaximize);

    return () => {
      ipcRenderer.removeListener("window-is-maximized", handleMaximize);
      ipcRenderer.removeListener("window-is-unmaximized", handleMaximize);
    };
  },

  saveUploadedFile: (fileBuffer: ArrayBuffer, fileName: string) =>
    ipcRenderer.invoke("save-uploaded-file", fileBuffer, fileName),
  getSavedWallpapers: () => ipcRenderer.invoke("get-saved-wallpapers"),
  deleteSavedWallpaper: (fileUrlOrName: string) =>
    ipcRenderer.invoke("delete-saved-wallpaper", fileUrlOrName),
});
