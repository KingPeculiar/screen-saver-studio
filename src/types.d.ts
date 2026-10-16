export interface IElectronAPI {
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  openScreenSaverWindow: (config: ScreenSaverLaunchConfig) => void;
  isWindowMaximized: () => Promise<boolean>;
  onMaximizeStateChange: (
    callback: (isMaximized: boolean) => void,
  ) => () => void;
  saveUploadedFile: (
    fileBuffer: ArrayBuffer,
    fileName: string,
  ) => Promise<SaveFileResult>;
  getSavedWallpapers: () => Promise<string[]>;
  deleteSavedWallpaper: (fileUrlOrName: string) => Promise<DeleteFileResult>;
  getClockFormat: () => Promise<"12h" | "24h">;
  setClockFormat: (format: "12h" | "24h") => void;
}

export interface ScreenSaverLaunchConfig {
  activeType: "wallpaper" | "clock" | "gradient";
  clockConfig: {
    clockType: string;
    is24Hour: boolean;
    accentColor: string;
    showDate: boolean;
    showWeather: boolean;
    showBattery: boolean;
  };
  wallpaperConfig: {
    category: string;
    selectedUrl: string;
  };
  gradientConfig: {
    mode: string;
    colorClass: string;
  };
}

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  fileUrl?: string;
  error?: string;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
