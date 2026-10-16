import React, { useState } from "react";
import Header from "../components/header";
import { WallpaperTabs } from "../components/wallpaper-tabs";
import { SavedWallpapers } from "../components/saved-wallpapers";
import { Separator } from "../components/ui/separator";

export default function Wallpaper() {
  const [uploadsVersion, setUploadsVersion] = useState(0);

  return (
    <main className="typeset typeset-chat m-auto">
      <Header
        title="Wallpaper"
        subtitle="Select gallery collection or upload local custom images."
      />
      <WallpaperTabs
        onUploadComplete={() => setUploadsVersion((version) => version + 1)}
      />
      <Separator />
      <SavedWallpapers key={uploadsVersion} />
    </main>
  );
}
