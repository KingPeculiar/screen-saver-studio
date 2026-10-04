import React, { useState, useEffect } from "react";
import { CloudSun, BatteryMedium } from "lucide-react";

interface AnalogClockProps {
  is24Hour?: boolean;
  accentColor?: string;
  showDate?: boolean;
  showWeather?: boolean;
  showBattery?: boolean;
}

const accentBgMap: Record<string, string> = {
  ring: "bg-(--ring)",
  secondary: "bg-(--secondary)",
  accent: "bg-(--accent)",
  destructive: "bg-(--destructive)",
};

export function AnalogClock({
  is24Hour = false,
  accentColor = "ring",
  showDate = true,
  showWeather = false,
  showBattery = false,
}: AnalogClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondsDegrees = (seconds / 60) * 360;
  const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hoursDegrees = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const dateString = time.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const currentAccentBg = accentBgMap[accentColor] || "bg-(--ring)";

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl gap-3">
      {(showWeather || showBattery) && (
        <div className="flex items-center gap-3 text-xs font-semibold">
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
      )}

      {/* Clock Face Container */}
      <div className="relative w-64 h-64 rounded-full bg-gray-950 border-4 border-gray-800 flex items-center justify-center shadow-inner">
        <span className="absolute top-2 text-xs font-bold text-gray-500">
          12
        </span>
        <span className="absolute right-3 text-xs font-bold text-gray-500">
          3
        </span>
        <span className="absolute bottom-2 text-xs font-bold text-gray-500">
          6
        </span>
        <span className="absolute left-3 text-xs font-bold text-gray-500">
          9
        </span>

        {/* Center Pivot Pin */}
        <div
          className={`absolute z-40 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${currentAccentBg}`}
        />

        {/* Hour Hand */}
        <div
          className="absolute z-10 w-1.5 h-16 bg-white rounded-full origin-bottom transition-transform duration-200 ease-linear"
          style={{ bottom: "50%", transform: `rotate(${hoursDegrees}deg)` }}
        />
        {/* Minute Hand */}
        <div
          className="absolute z-20 w-1 h-22 bg-gray-300 rounded-full origin-bottom transition-transform duration-200 ease-linear"
          style={{ bottom: "50%", transform: `rotate(${minutesDegrees}deg)` }}
        />
        {/* Second Hand */}
        <div
          className={`absolute z-30 w-0.5 h-24 rounded-full origin-bottom transition-transform duration-100 ease-linear ${currentAccentBg}`}
          style={{ bottom: "50%", transform: `rotate(${secondsDegrees}deg)` }}
        />
      </div>

      <div className="flex flex-col items-center gap-1 mt-2">
        <div className="text-xs font-mono font-medium text-gray-400">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: !is24Hour,
          })}
        </div>
        {showDate && (
          <div className="text-xs text-gray-500 font-medium">{dateString}</div>
        )}
      </div>
    </div>
  );
}
