import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
  IpcMainEvent,
  protocol,
  net,
} from "electron";
import Store from "electron-store";
import path from "node:path";
import started from "electron-squirrel-startup";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import type { ScreenSaverLaunchConfig } from "./types";
import {autoUpdater} from "electron-updater"
import log from 'electron-log';

autoUpdater.logger = log;
(autoUpdater.logger as any).transports.file.level = 'info';

autoUpdater.autoDownload = true;

function checkForUpdates(win: BrowserWindow) {
  if (!app.isPackaged) {
    console.log('Skipping update check in development mode.');
    return;
  }

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    win.webContents.send('update-available');
  });

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded');
  });
}

interface StoreSchema {
  clockFormat: "12h" | "24h";
}

const store = new Store<StoreSchema>({
  defaults: {
    clockFormat: "12h",
  },
});

ipcMain.handle("get-clock-format", () => {
  return store.get("clockFormat");
});

ipcMain.on("set-clock-format", (_event, format: "12h" | "24h") => {
  store.set("clockFormat", format);
});

protocol.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

let mainWindow: BrowserWindow | null = null;
let screenSaverWindow: BrowserWindow | null = null;

const createScreenSaverWindow = (config: ScreenSaverLaunchConfig) => {
  if (screenSaverWindow && !screenSaverWindow.isDestroyed()) {
    screenSaverWindow.focus();
    return;
  }

  const window = new BrowserWindow({
    show: false,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      webSecurity: false,
    },
  });
  screenSaverWindow = window;

  window.webContents.on('did-finish-load', () => {
    checkForUpdates(window);
    });

  window.once("ready-to-show", () => window.show());
  window.on("closed", () => {
    if (screenSaverWindow === window) {
      screenSaverWindow = null;
    }
  });

  const launchQuery = `#/screensaver?config=${encodeURIComponent(JSON.stringify(config))}`;
  const loadPromise = MAIN_WINDOW_VITE_DEV_SERVER_URL
    ? window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}${launchQuery}`)
    : window.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
        { hash: launchQuery.slice(1) },
      );

  void loadPromise.catch((error: unknown) => {
    console.error("Failed to load screen saver window", error);
    if (!window.isDestroyed()) {
      window.close();
    }
  });
};

ipcMain.on('restart-to-update', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on(
  "open-screen-saver-window",
  (_event, config: ScreenSaverLaunchConfig) => createScreenSaverWindow(config),
);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const getUploadsDirectory = async (): Promise<string> => {
  const uploadsPath = path.join(app.getPath("userData"), "custom_wallpapers");
  await fs.mkdir(uploadsPath, { recursive: true });
  return uploadsPath;
};

const resolveCustomWallpaperPath = (input: string): string => {
  const sanitizedInput = input
    .replace(/^media:\/\//i, "")
    .replace(/^custom_wallpapers\/+/, "")
    .replace(/^\/+/, "");

  const rootDirectory = path.resolve(app.getPath("userData"), "custom_wallpapers");
  const decodedInput = decodeURIComponent(sanitizedInput);
  const candidatePath = path.resolve(rootDirectory, decodedInput);
  const relativePath = path.relative(rootDirectory, candidatePath);

  if (
    candidatePath === rootDirectory ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Blocked attempt to access an invalid wallpaper path: ${input}`);
  }

  return candidatePath;
};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    // frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(
        __dirname,
        MAIN_WINDOW_VITE_DEV_SERVER_URL ? "preload.js" : "preload.js",
      ),
      contextIsolation: true,
      nodeIntegration: false,
      // enableRemoteModule: false,
      spellcheck: false,
      webSecurity: false,
    },
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("maximize", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("window-is-maximized", true);
    }
  });

  mainWindow.on("unmaximize", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("window-is-unmaximized", false);
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.setMenuBarVisibility(false);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.handle(
  "get-window-maximized-state",
  (event: IpcMainInvokeEvent): boolean => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win && !win.isDestroyed() ? win.isMaximized() : false;
  },
);

ipcMain.handle("get-saved-wallpapers", async () => {
  try {
    const dir = path.join(app.getPath("userData"), "custom_wallpapers");
    await fs.mkdir(dir, { recursive: true });

    const files = await fs.readdir(dir);

    // Return relative paths that match our media:// protocol
    return files.map((file) => `media://custom_wallpapers/${file}`);
  } catch (error) {
    console.error("Error reading custom wallpapers:", error);
    return [];
  }
});

ipcMain.handle(
  "save-uploaded-file",
  async (
    _event: IpcMainInvokeEvent,
    fileBuffer: ArrayBuffer,
    fileName: string,
  ): Promise<{
    success: boolean;
    filePath?: string;
    fileUrl?: string;
    error?: string;
  }> => {
    try {
      const dir = await getUploadsDirectory();
      // Sanitize file name and create destination path
      const safeFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const destinationPath = path.join(dir, safeFileName);

      // Convert ArrayBuffer to Node.js Buffer and write to disk
      const buffer = Buffer.from(fileBuffer);
      await fs.writeFile(destinationPath, buffer);

      return {
        success: true,
        filePath: destinationPath,
        fileUrl: `media://custom_wallpapers/${safeFileName}`,
      };
    } catch (err: any) {
      console.error("Failed to save file:", err);
      return { success: false, error: err.message };
    }
  },
);

ipcMain.handle(
  "delete-saved-wallpaper",
  async (
    _event: IpcMainInvokeEvent,
    fileUrlOrName: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const fileName = fileUrlOrName.replace("media://custom_wallpapers/", "");

      const baseDir = path.join(app.getPath("userData"), "custom_wallpapers");
      const targetPath = path.join(baseDir, path.basename(fileName));

      await fs.unlink(targetPath);

      return { success: true };
    } catch (err: any) {
      console.error("Failed to delete file:", err);
      return { success: false, error: err.message };
    }
  },
);

ipcMain.on("window-minimize", (event: IpcMainEvent): void => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) {
    win.minimize();
  }
});

ipcMain.on("window-maximize", (event: IpcMainEvent): void => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on("window-close", (event: IpcMainEvent): void => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) {
    win.close();
  }
});

// app.whenReady().then(createWindow);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.whenReady().then(() => {
  // Handle custom "media://" protocol requests
  protocol.handle("media", (request) => {
    const filePath = resolveCustomWallpaperPath(request.url);
    return net.fetch(pathToFileURL(filePath).toString());
  });

  // createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
