import React, { useRef, useState, ChangeEvent } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { WandSparkles, Upload } from "lucide-react";
import { assetsByCategory } from "../lib/assets";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function WallpaperTabs() {
  const categories = Object.keys(assetsByCategory);
  const defaultCategory = categories[0] || "anime";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    // Programmatically trigger the file input
    fileInputRef.current?.click();
  };

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

      if (result.success && result.filePath) {
        setSavedPath(result.filePath);
      } else {
        setError(result.error || "Failed to save wallpaper.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full py-8">
      <Tabs defaultValue={defaultCategory} className="w-full">
        <TabsList className="bg-transparent h-full! grid grid-cols-4 gap-5 w-full">
          {categories.map((folderName) => {
            const count = Object.keys(
              assetsByCategory[folderName] || {},
            ).length;
            return (
              <TabsTrigger
                key={folderName}
                value={folderName}
                className="flex items-center gap-2 flex-col p-4 text-white border border-blue-950 bg-gray-900 rounded-3xl capitalize data-[state=active]:bg-blue-900"
              >
                <WandSparkles size={24} color="#ffffff" />
                <p className="text-[18px]">{folderName}</p>
                <span className="text-xs text-gray-400">{count} items</span>
              </TabsTrigger>
            );
          })}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            variant="outline"
            className="cursor-pointer flex items-center gap-2 flex-col p-4 text-white border border-blue-950 bg-gray-900 rounded-3xl capitalize data-[state=active]:bg-blue-900 w-full h-full"
          >
            <Input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              className="hidden"
            />
            <Upload color="#ffffff" />
            <span className="text-[18px] text-gray-400">
              {isSaving ? "Saving..." : "Import Wallpapers"}
            </span>
          </Button>
        </TabsList>
        {Object.entries(assetsByCategory).map(([folderName, files]) => {
          const fileEntries = Object.entries(files);
          return (
            <>
              <TabsContent value={folderName} key={folderName} className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[16px] font-semibold uppercase">
                    {folderName} Wallpapers Preview & Selection
                  </span>
                  <span className="text-sm text-gray-400">
                    {fileEntries.length} wallpapers available
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {fileEntries.map(([fileName, url]) => (
                    <div
                      key={fileName}
                      className="overflow-hidden rounded-xl border border-gray-800"
                    >
                      <img
                        src={url}
                        alt={fileName}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </>
          );
        })}
      </Tabs>
    </div>
  );
}
