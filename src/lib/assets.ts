// Uses '**/*' to scan all files inside nested subdirectories
const assetModules = import.meta.glob<{ default: string }>(
  "../assets/**/*.{png,jpg,jpeg,svg,webp,gif}",
  { eager: true, query: "?url", import: "default" },
);

export interface CategorizedAssets {
  [folderName: string]: {
    [fileName: string]: string; // Asset URL
  };
}

/**
 * Categorizes assets by their immediate subfolder name:
 * {
 *   wallpapers: { 'nature.png': '/assets/wallpapers/nature.png' },
 *   clocks: { 'analog.png': '/assets/clocks/analog.png' }
 * }
 */
export const assetsByCategory = Object.entries(assetModules).reduce(
  (acc, [path, url]) => {
    // Standardize path separators
    const normalizedPath = path.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");

    const fileName = parts.pop() || "";
    const folderName = parts.pop() || "root";

    if (!acc[folderName]) {
      acc[folderName] = {};
    }

    acc[folderName][fileName] = url as unknown as string;
    return acc;
  },
  {} as CategorizedAssets,
);

/**
 * Get an asset URL directly by folder and filename
 */
export const getAsset = (folder: string, fileName: string): string => {
  return assetsByCategory[folder]?.[fileName] || "";
};
