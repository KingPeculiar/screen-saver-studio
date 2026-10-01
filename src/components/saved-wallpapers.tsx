import React, { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { TrashIcon } from "lucide-react";

export function SavedWallpapers() {
  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const loadWallpapers = async () => {
    setLoading(true);
    const savedUrls = await window.electronAPI.getSavedWallpapers();
    setWallpapers(savedUrls);
    setLoading(false);
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
        // Remove item from state without needing a full reload
        setWallpapers((prev) => prev.filter((url) => url !== mediaUrl));
      } else {
        alert(`Failed to delete: ${result.error}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
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

      {wallpapers.length === 0 ? (
        <p className="text-sm text-gray-500">
          No custom wallpapers uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wallpapers.map((mediaUrl) => (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  key={mediaUrl}
                  className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950"
                >
                  <img
                    src={mediaUrl}
                    alt="Custom wallpaper"
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
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
