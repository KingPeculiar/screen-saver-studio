import React, { useEffect } from "react";
import { useScreenSaver } from "../context/screen-saver-context";
import { DigitalClock } from "../components/digital-clock";
import { AnalogClock } from "../components/analog-clock";
import { assetsByCategory } from "../lib/assets";

export function FullscreenScreenSaver() {
  const {
    activeType,
    clockConfig,
    wallpaperConfig,
    gradientConfig,
  } = useScreenSaver();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.electronAPI.closeWindow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Resolve wallpaper image URL
  const getWallpaperUrl = () => {
    if (wallpaperConfig.selectedUrl) {
      return wallpaperConfig.selectedUrl;
    }
    const cat = wallpaperConfig.category || "anime";
    const categoryFiles = assetsByCategory[cat] || {};
    const firstFileName = Object.keys(categoryFiles)[0];
    if (firstFileName) {
      return categoryFiles[firstFileName];
    }
    // Fallback to any available asset
    for (const folder of Object.keys(assetsByCategory)) {
      const files = Object.keys(assetsByCategory[folder]);
      if (files.length > 0) {
        return assetsByCategory[folder][files[0]];
      }
    }
    return "";
  };

  return (
    <div
      onClick={() => window.electronAPI.closeWindow()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer overflow-hidden animate-in fade-in-0 duration-300"
    >
      {/* 1. Wallpaper Screen Saver */}
      {activeType === "wallpaper" && (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={getWallpaperUrl()}
            alt="Screen Saver Wallpaper"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white text-xs opacity-75">
            Press ESC or click anywhere to exit screen saver
          </div>
        </div>
      )}

      {/* 2. Clock Screen Saver */}
      {activeType === "clock" && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-950">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-transparent to-purple-950/30 pointer-events-none" />
          <div className="scale-125 transform">
            {clockConfig.clockType === "analog-classic" ? (
              <AnalogClock
                is24Hour={clockConfig.is24Hour}
                accentColor={clockConfig.accentColor}
                showDate={clockConfig.showDate}
                showWeather={clockConfig.showWeather}
                showBattery={clockConfig.showBattery}
              />
            ) : (
              <DigitalClock
                is24Hour={clockConfig.is24Hour}
                accentColor={clockConfig.accentColor}
                showDate={clockConfig.showDate}
                showWeather={clockConfig.showWeather}
                showBattery={clockConfig.showBattery}
              />
            )}
          </div>
          <div className="absolute bottom-6 text-gray-500 text-xs">
            Press ESC or click anywhere to exit screen saver
          </div>
        </div>
      )}

      {/* 3. Gradient Screen Saver */}
      {activeType === "gradient" && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div
            className={`absolute inset-0 w-full h-full ${
              gradientConfig.colorClass || "night-fade-l"
            } animate-gradient`}
          />
          <div className="absolute bottom-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white/80 text-xs">
            Press ESC or click anywhere to exit screen saver
          </div>
        </div>
      )}
    </div>
  );
}
