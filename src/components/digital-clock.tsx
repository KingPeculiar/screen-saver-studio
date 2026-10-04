import React, { useState, useEffect } from "react";
import { Clock as ClockIcon, CloudSun, BatteryMedium } from "lucide-react";

interface DigitalClockProps {
  is24Hour?: boolean;
  accentColor?: string;
  showDate?: boolean;
  showWeather?: boolean;
  showBattery?: boolean;
}

const accentColorMap: Record<string, string> = {
  ring: "text-(--ring)",
  secondary: "text-(--secondary)",
  accent: "text-(--accent)",
  destructive: "text-(--destructive)",
};

export function DigitalClock({
  is24Hour: is24HourProp,
  accentColor = "ring",
  showDate = true,
  showWeather = false,
  showBattery = false,
}: DigitalClockProps) {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    if (is24HourProp === undefined) {
      window.electronAPI.getClockFormat().then((format) => {
        setIs24Hour(format === "24h");
      });
    }
  }, [is24HourProp]);

  useEffect(() => {
    if (showBattery && "getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, [showBattery]);

  const activeIs24Hour = is24HourProp !== undefined ? is24HourProp : is24Hour;
  const currentAccentClass = accentColorMap[accentColor] || "text-(--ring)";

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !activeIs24Hour,
  });

  const dateString = time.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock flex flex-col items-center justify-center p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md w-full h-auto min-h-45 shadow-2xl gap-2">
      <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
        {showWeather && (
          <div className="flex items-center gap-1 bg-gray-800/60 px-2.5 py-1 rounded-full text-amber-300">
            <CloudSun size={14} />
            <span>22°C, Sunny</span>
          </div>
        )}
        {showBattery && (
          <div className="flex items-center gap-1 bg-gray-800/60 px-2.5 py-1 rounded-full text-emerald-400">
            <BatteryMedium size={14} />
            <span>{batteryLevel !== null ? `${batteryLevel}%` : "85%"}</span>
          </div>
        )}
      </div>

      <div className={`flex items-center gap-2 mb-1 ${currentAccentClass}`}>
        <ClockIcon size={18} />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Current Time
        </span>
      </div>
      <div className="flex items-baseline gap-1 text-white font-mono">
        <span className="text-5xl font-bold tracking-tight">
          {formattedTime}
        </span>
      </div>
      {showDate && (
        <div className="text-sm text-gray-400 font-medium">{dateString}</div>
      )}
    </div>
  );
}
