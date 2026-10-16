import React, { useRef, useState, ChangeEvent, memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { WandSparkles, Upload, Landmark, Feather } from "lucide-react";
import { assetsByCategory } from "../lib/assets";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useScreenSaver } from "../context/screen-saver-context";

interface WallpaperThumbnailProps {
  fileName: string;
  url: string;
  selected: boolean;
  onSelect: () => void;
}

const WallpaperThumbnail = memo(
  ({ fileName, url, selected, onSelect }: WallpaperThumbnailProps) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <button
        type="button"
        aria-label={`Select wallpaper ${fileName}`}
        aria-pressed={selected}
        onClick={onSelect}
        className={`relative block overflow-hidden rounded-xl border bg-gray-900 h-48 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
          selected ? "border-blue-400" : "border-gray-800"
        }`}
      >
        {!loaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}
        <img
          src={url}
          alt={fileName}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`m-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300 will-change-transform ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {selected && (
          <span className="absolute right-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
            Selected
          </span>
        )}
      </button>
    );
  },
);

export function WallpaperTabs({
  onUploadComplete,
}: {
  onUploadComplete?: () => void;
}) {
  const { wallpaperConfig, setWallpaperConfig } = useScreenSaver();
  const categories = Object.keys(assetsByCategory);
  const defaultCategory = categories[0] || "anime";
  const activeCategory = wallpaperConfig.category || defaultCategory;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsSaving(true);
    setError(null);

    try {
      // 1. Convert File to ArrayBuffer for IPC transfer
      const arrayBuffer = await file.arrayBuffer();

      // 2. Invoke Main Process via IPC bridge
      const result = await window.electronAPI.saveUploadedFile(
        arrayBuffer,
        file.name,
      );
      const { fileUrl } = result;

      if (result.success && fileUrl) {
        setWallpaperConfig((current) => ({
          ...current,
          selectedUrl: fileUrl,
        }));
        onUploadComplete?.();
      } else {
        setError(result.error || "Failed to save wallpaper.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsSaving(false);
      e.target.value = "";
    }
  };

  return (
    <div className="w-full py-8">
      <Tabs
        value={activeCategory}
        onValueChange={(val) => {
          if (val) {
            setWallpaperConfig((current) => ({
              ...current,
              category: val,
              selectedUrl: "",
            }));
          }
        }}
        className="w-full"
      >
        <TabsList className="bg-transparent h-full! grid grid-cols-4 gap-5 w-full">
          {categories.map((folderName, index) => {
            const count = Object.keys(
              assetsByCategory[folderName] || {},
            ).length;
            const isTabActive = activeCategory === folderName;

            return (
              <TabsTrigger
                key={folderName}
                value={folderName}
                className={`flex items-center gap-2 flex-col p-4 rounded-3xl capitalize transition-all cursor-pointer ${
                  isTabActive
                    ? "bg-blue-900! border border-blue-500 text-white shadow-lg shadow-blue-950/50"
                    : "bg-gray-900 border border-blue-950 text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {index === 0 && (
                  <WandSparkles color={isTabActive ? "#60a5fa" : "#9fa0c3"} />
                )}
                {index === 1 && (
                  <Landmark color={isTabActive ? "#60a5fa" : "#9fa0c3"} />
                )}
                {index === 2 && (
                  <Feather color={isTabActive ? "#60a5fa" : "#9fa0c3"} />
                )}
                <p className="text-[18px]">{folderName}</p>
                <span
                  className={`text-xs ${
                    isTabActive ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {count} items
                </span>
              </TabsTrigger>
            );
          })}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            variant="outline"
            className="cursor-pointer flex items-center gap-2 flex-col p-4 text-white border border-blue-950 bg-gray-900 rounded-3xl capitalize data-[state=active]:bg-blue-900 w-full h-full"
          >
            <Upload color="#ffffff" />
            <span className="text-[18px] text-gray-400">
              {isSaving ? "Saving..." : "Import Wallpapers"}
            </span>
          </Button>
          <Input
            ref={fileInputRef}
            onChange={handleFileChange}
            type="file"
            accept=".jpg, .jpeg, .png, .gif"
            className="hidden"
          />
        </TabsList>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}
        {Object.entries(assetsByCategory).map(([folderName, files]) => {
          const fileEntries = Object.entries(files);
          const isActive = activeCategory === folderName;

          return (
            <TabsContent value={folderName} key={folderName} className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[16px] font-semibold uppercase">
                  {folderName} Wallpapers Preview & Selection
                </span>
                <span className="text-sm text-gray-400">
                  {fileEntries.length} wallpapers available
                </span>
              </div>
              {isActive && (
                <div className="grid grid-cols-3 gap-4">
                  {fileEntries.map(([fileName, url]) => (
                    <WallpaperThumbnail
                      key={fileName}
                      fileName={fileName}
                      url={url}
                      selected={wallpaperConfig.selectedUrl === url}
                      onSelect={() =>
                        setWallpaperConfig((current) => ({
                          ...current,
                          category: folderName,
                          selectedUrl: url,
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
