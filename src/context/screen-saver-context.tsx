import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PreferenceType = "wallpaper" | "clock" | "gradient";

export interface ClockConfig {
  clockType: string;
  is24Hour: boolean;
  accentColor: string;
  showDate: boolean;
  showWeather: boolean;
  showBattery: boolean;
}

export interface WallpaperConfig {
  category: string;
  selectedUrl: string;
}

export interface GradientConfig {
  mode: string;
  colorClass: string;
}

interface ScreenSaverContextType {
  activeType: PreferenceType;
  setActiveType: (type: PreferenceType) => void;
  clockConfig: ClockConfig;
  setClockConfig: React.Dispatch<React.SetStateAction<ClockConfig>>;
  wallpaperConfig: WallpaperConfig;
  setWallpaperConfig: React.Dispatch<React.SetStateAction<WallpaperConfig>>;
  gradientConfig: GradientConfig;
  setGradientConfig: React.Dispatch<React.SetStateAction<GradientConfig>>;
  isFullscreen: boolean;
  launchFullscreen: () => void;
  exitFullscreen: () => void;
  applyAndLaunch: (type?: PreferenceType) => void;
}

const ScreenSaverContext = createContext<ScreenSaverContextType | undefined>(undefined);

const STORAGE_KEY = "screen_saver_studio_config";

export function ScreenSaverProvider({ children }: { children: ReactNode }) {
  const [activeType, setActiveType] = useState<PreferenceType>("wallpaper");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  const [clockConfig, setClockConfig] = useState<ClockConfig>({
    clockType: "digital-minimal",
    is24Hour: false,
    accentColor: "ring",
    showDate: true,
    showWeather: false,
    showBattery: false,
  });

  const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperConfig>({
    category: "anime",
    selectedUrl: "",
  });

  const [gradientConfig, setGradientConfig] = useState<GradientConfig>({
    mode: "Animated Linear",
    colorClass: "night-fade-l",
  });

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (["wallpaper", "clock", "gradient"].includes(parsed.activeType)) {
          setActiveType(parsed.activeType);
        }
        if (parsed.clockConfig) setClockConfig(parsed.clockConfig);
        if (parsed.wallpaperConfig) setWallpaperConfig(parsed.wallpaperConfig);
        if (parsed.gradientConfig) setGradientConfig(parsed.gradientConfig);
      }
    } catch (e) {
      console.error("Failed to load screen saver configuration", e);
    } finally {
      setPreferencesLoaded(true);
    }
  }, []);

  // Save preferences whenever state changes
  useEffect(() => {
    if (!preferencesLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeType,
          clockConfig,
          wallpaperConfig,
          gradientConfig,
        }),
      );
    } catch (e) {
      console.error("Failed to save screen saver configuration", e);
    }
  }, [activeType, clockConfig, wallpaperConfig, gradientConfig, preferencesLoaded]);

  const launchFullscreen = () => setIsFullscreen(true);
  const exitFullscreen = () => setIsFullscreen(false);

  const applyAndLaunch = (type?: PreferenceType) => {
    if (type) {
      setActiveType(type);
    }
    setIsFullscreen(true);
  };

  return (
    <ScreenSaverContext.Provider
      value={{
        activeType,
        setActiveType,
        clockConfig,
        setClockConfig,
        wallpaperConfig,
        setWallpaperConfig,
        gradientConfig,
        setGradientConfig,
        isFullscreen,
        launchFullscreen,
        exitFullscreen,
        applyAndLaunch,
      }}
    >
      {children}
    </ScreenSaverContext.Provider>
  );
}

export function useScreenSaver() {
  const context = useContext(ScreenSaverContext);
  if (!context) {
    throw new Error("useScreenSaver must be used within a ScreenSaverProvider");
  }
  return context;
}
