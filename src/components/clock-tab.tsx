import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import { AnalogClock } from "./analog-clock";
import { DigitalClock } from "./digital-clock";
import { useScreenSaver } from "../context/screen-saver-context";

export default function ClockTab() {
  const { clockConfig, setClockConfig } = useScreenSaver();
  const {
    is24Hour,
    clockType,
    accentColor,
    showDate,
    showWeather,
    showBattery,
  } = clockConfig;

  const visuals = [
    { label: "Digital Minimal", value: "digital-minimal" },
    { label: "Analog Classic", value: "analog-classic" },
  ];

  useEffect(() => {
    window.electronAPI.getClockFormat().then((format) => {
      setClockConfig((current) => ({ ...current, is24Hour: format === "24h" }));
    });
  }, [setClockConfig]);

  const handleToggleFormat = (checked: boolean) => {
    setClockConfig((current) => ({ ...current, is24Hour: checked }));
    window.electronAPI?.setClockFormat(checked ? "24h" : "12h");
  };

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
        {clockType === "analog-classic" && (
          <AnalogClock
            is24Hour={is24Hour}
            accentColor={accentColor}
            showDate={showDate}
            showWeather={showWeather}
            showBattery={showBattery}
          />
        )}
        {clockType === "digital-minimal" && (
          <DigitalClock
            is24Hour={is24Hour}
            accentColor={accentColor}
            showDate={showDate}
            showWeather={showWeather}
            showBattery={showBattery}
          />
        )}
        <TabsContent value="format">
          <Card>
            <CardContent>
              <div className="flex justify-between">
                <Label htmlFor="format">24 Hour Format</Label>
                <Switch
                  id="format"
                  checked={is24Hour}
                  onCheckedChange={handleToggleFormat}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="style">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between">
                <Label>Clock Visual Type</Label>
                <Select
                  value={clockType}
                  onValueChange={(value) => {
                    if (value) {
                      setClockConfig((current) => ({
                        ...current,
                        clockType: value,
                      }));
                    }
                  }}
                >
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
                <ToggleGroup
                  value={[accentColor]}
                  onValueChange={(value: string[]) => {
                    if (value && value.length > 0) {
                      setClockConfig((current) => ({
                        ...current,
                        accentColor: value[0],
                      }));
                    }
                  }}
                >
                  {["ring", "secondary", "accent", "destructive"].map(
                    (color, index) => (
                      <ToggleGroupItem
                        key={index}
                        value={color}
                        className="rounded-full p-0 flex-0 overflow-hidden gap-0"
                        variant="outline"
                      >
                        <span
                          className={`w-6 h-6 rounded-full ${
                            color === "ring"
                              ? "bg-(--ring)"
                              : color === "secondary"
                                ? "bg-(--secondary)"
                                : color === "accent"
                                  ? "bg-(--accent)"
                                  : "bg-(--destructive)"
                          }`}
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
                  <Checkbox
                    id="date-widget"
                    name="date-widget"
                    checked={showDate}
                    onCheckedChange={(checked) =>
                      setClockConfig((current) => ({
                        ...current,
                        showDate: Boolean(checked),
                      }))
                    }
                  />
                </Field>
                <Separator />
                <Field
                  orientation="horizontal"
                  className="flex flex-row justify-between items-center w-full"
                >
                  <Label htmlFor="weather-widget">Weather Widget</Label>
                  <Checkbox
                    id="weather-widget"
                    name="weather-widget"
                    checked={showWeather}
                    onCheckedChange={(checked) =>
                      setClockConfig((current) => ({
                        ...current,
                        showWeather: Boolean(checked),
                      }))
                    }
                  />
                </Field>
                <Separator />
                <Field
                  orientation="horizontal"
                  className="flex flex-row justify-between items-center w-full"
                >
                  <Label htmlFor="battery-percentage">Battery Percentage</Label>
                  <Checkbox
                    id="battery-percentage"
                    name="battery-percentage"
                    checked={showBattery}
                    onCheckedChange={(checked) =>
                      setClockConfig((current) => ({
                        ...current,
                        showBattery: Boolean(checked),
                      }))
                    }
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
