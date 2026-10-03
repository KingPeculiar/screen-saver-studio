import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock as ClockIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Field } from "./ui/field";
import { Checkbox } from "./ui/checkbox";

export default function ClockTab() {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(false);

  const visuals = [
    { label: "Digital Minimal", value: "digital-minimal" },
    { label: "Analog Classic", value: "analog-classic" },
  ];

  useEffect(() => {
    window.electronAPI.getClockFormat().then((format) => {
      setIs24Hour(format === "24h");
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleFormat = () => {
    const nextIs24Hour = !is24Hour;
    setIs24Hour(nextIs24Hour);
    window.electronAPI.setClockFormat(nextIs24Hour ? "24h" : "12h");
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour,
  });

  const dateString = time.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full pt-8">
      <Tabs>
        <TabsList className="w-full bg-gray-900/90 h-12! rounded-3xl">
          <TabsTrigger value="format" className="rounded-2xl">
            Format
          </TabsTrigger>
          <TabsTrigger value="style" className="rounded-2xl">
            Style
          </TabsTrigger>
          <TabsTrigger value="widget" className="rounded-2xl">
            Widget
          </TabsTrigger>
        </TabsList>
        <div className="clock flex flex-col items-center justify-center p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md w-full h-45 shadow-2xl">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
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
          <div className="mt-2 text-sm text-gray-400 font-medium">
            {dateString}
          </div>
        </div>
        <TabsContent value="format">
          <Card>
            <CardContent>
              <div className="flex justify-between">
                <Label htmlFor="format">24 Hour Format</Label>
                <Switch id="format" onCheckedChange={handleToggleFormat} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="style">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between">
                <Label>Clock Visual Type</Label>
                <Select items={visuals} defaultValue={visuals[0].value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectGroup>
                      {visuals.map((visual) => (
                        <SelectItem key={visual.value} value={visual.value}>
                          {visual.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex flex-row justify-between items-center">
                <Label>Clock Accent Color</Label>
                <ToggleGroup>
                  {["ring", "secondary", "accent", "destructive"].map(
                    (color, index) => (
                      <ToggleGroupItem
                        key={index}
                        value={color}
                        className="rounded-full p-0 flex-0 overflow-hidden gap-0"
                        variant="outline"
                      >
                        <span
                          className={`w-6 h-6 rounded-full ${color === "ring" ? "bg-(--ring)" : color === "secondary" ? "bg-(--secondary)" : color === "accent" ? "bg-(--accent)" : "bg-(--destructive)"}`}
                        ></span>
                      </ToggleGroupItem>
                    ),
                  )}
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="widget">
          <Card>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Field
                  orientation="horizontal"
                  className="flex flex-row justify-between items-center w-full"
                >
                  <Label htmlFor="date-widget">Date Widget</Label>
                  <Checkbox id="date-widget" name="date-widget" />
                </Field>
                <Separator />
                <Field
                  orientation="horizontal"
                  className="flex flex-row justify-between items-center w-full"
                >
                  <Label htmlFor="weather-widget">Weather Widget</Label>
                  <Checkbox id="weather-widget" name="weather-widget" />
                </Field>
                <Separator />
                <Field
                  orientation="horizontal"
                  className="flex flex-row justify-between items-center w-full"
                >
                  <Label htmlFor="clock-widget">Battery Percentage</Label>
                  <Checkbox id="battery-percentage" name="battery-percentage" />
                </Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
