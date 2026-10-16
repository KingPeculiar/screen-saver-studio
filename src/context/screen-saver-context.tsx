import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ScreenSaverLaunchConfig } from "../types";

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
  launchFullscreen: (type?: PreferenceType) => void;
  applyAndLaunch: (type?: PreferenceType) => void;
}

const ScreenSaverContext = createContext<ScreenSaverContextType | undefined>(undefined);

const STORAGE_KEY = "screen_saver_studio_config";

export function ScreenSaverProvider({ children }: { children: ReactNode }) {
  const [activeType, setActiveType] = useState<PreferenceType>("wallpaper");
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

      const query = window.location.hash.split("?")[1];
      const serializedConfig = query
        ? new URLSearchParams(query).get("config")
        : null;
      if (serializedConfig) {
        const launchConfig: unknown = JSON.parse(serializedConfig);
        if (isScreenSaverLaunchConfig(launchConfig)) {
          setActiveType(launchConfig.activeType);
          setClockConfig(launchConfig.clockConfig);
          setWallpaperConfig(launchConfig.wallpaperConfig);
          setGradientConfig(launchConfig.gradientConfig);
        } else {
          throw new Error("Invalid screen saver launch configuration");
        }
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

  const launchFullscreen = (type?: PreferenceType) => {
    const config: ScreenSaverLaunchConfig = {
      activeType: type ?? activeType,
      clockConfig,
      wallpaperConfig,
      gradientConfig,
    };
    if (type) {
      setActiveType(type);
    }
    window.electronAPI.openScreenSaverWindow(config);
  };

  const applyAndLaunch = (type?: PreferenceType) => {
    launchFullscreen(type);
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
        launchFullscreen,
        applyAndLaunch,
      }}
    >
      {children}
    </ScreenSaverContext.Provider>
  );
}

function isScreenSaverLaunchConfig(
  config: unknown,
): config is ScreenSaverLaunchConfig {
  if (!isRecord(config)) return false;
  const candidate = config;
  const clock = candidate.clockConfig;
  const wallpaper = candidate.wallpaperConfig;
  const gradient = candidate.gradientConfig;

  return (
    ["wallpaper", "clock", "gradient"].includes(String(candidate.activeType)) &&
    isRecord(clock) &&
    typeof clock.clockType === "string" &&
    typeof clock.is24Hour === "boolean" &&
    typeof clock.accentColor === "string" &&
    typeof clock.showDate === "boolean" &&
    typeof clock.showWeather === "boolean" &&
    typeof clock.showBattery === "boolean" &&
    isRecord(wallpaper) &&
    typeof wallpaper.category === "string" &&
    typeof wallpaper.selectedUrl === "string" &&
    isRecord(gradient) &&
    typeof gradient.mode === "string" &&
    typeof gradient.colorClass === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function useScreenSaver() {
  const context = useContext(ScreenSaverContext);
  if (!context) {
    throw new Error("useScreenSaver must be used within a ScreenSaverProvider");
  }
  return context;
}
