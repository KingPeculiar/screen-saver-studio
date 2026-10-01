export interface IElectronAPI {
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
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
}

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
