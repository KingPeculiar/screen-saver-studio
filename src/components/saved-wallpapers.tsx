import React, { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { TrashIcon } from "lucide-react";
import { useScreenSaver } from "../context/screen-saver-context";

export function SavedWallpapers() {
  const { wallpaperConfig, setWallpaperConfig } = useScreenSaver();
  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWallpapers = async () => {
    setLoading(true);
    try {
      const savedUrls = await window.electronAPI.getSavedWallpapers();
      setWallpapers(savedUrls);
      setError(null);
    } catch (err) {
      console.error("Failed to load custom wallpapers:", err);
      setError("Custom wallpapers could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallpapers();
  }, []);

  const handleDelete = async (mediaUrl: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this wallpaper?",
    );
    if (!confirmDelete) return;

    setDeletingUrl(mediaUrl);

    try {
      const result = await window.electronAPI.deleteSavedWallpaper(mediaUrl);

      if (result.success) {
        setWallpapers((prev) => prev.filter((url) => url !== mediaUrl));
        setWallpaperConfig((current) => ({
          ...current,
          selectedUrl:
            current.selectedUrl === mediaUrl ? "" : current.selectedUrl,
        }));
      } else {
        setError(`Failed to delete wallpaper: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("The wallpaper could not be deleted.");
    } finally {
      setDeletingUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 text-sm">Loading custom wallpapers...</div>
    );
  }

  return (
    <div className="w-full py-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Your Custom Wallpapers
      </h3>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}
      {wallpapers.length === 0 ? (
        <p className="text-sm text-gray-500">
          No custom wallpapers uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wallpapers.map((mediaUrl) => (
            <ContextMenu key={mediaUrl}>
              <ContextMenuTrigger>
                <button
                  type="button"
                  aria-label={`Select custom wallpaper ${mediaUrl}`}
                  aria-pressed={wallpaperConfig.selectedUrl === mediaUrl}
                  onClick={() =>
                    setWallpaperConfig((current) => ({
                      ...current,
                      selectedUrl: mediaUrl,
                    }))
                  }
                  className={`relative block w-full overflow-hidden rounded-xl border bg-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    wallpaperConfig.selectedUrl === mediaUrl
                      ? "border-blue-400"
                      : "border-gray-800"
                  }`}
                >
                  <img
                    src={mediaUrl}
                    alt="Custom wallpaper"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-40 object-cover m-0 hover:scale-105 transition-transform duration-200 will-change-transform"
                  />
                  {wallpaperConfig.selectedUrl === mediaUrl && (
                    <span className="absolute right-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                      Selected
                    </span>
                  )}
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(mediaUrl)}
                  disabled={deletingUrl === mediaUrl}
                >
                  <TrashIcon color="#fff" className="w-4 h-4" />
                  <span>Delete</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      )}
    </div>
  );
}
