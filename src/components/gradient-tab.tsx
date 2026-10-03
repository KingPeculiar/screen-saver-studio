import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { SlidersHorizontal } from "lucide-react";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

export default function GradientTab() {
  const [color, setColor] = useState("");

  const linearColors = [
    { name: "Night fade", className: "night-fade-l" },
    { name: "Star wine", className: "star-wine" },
    { name: "Solid stone", className: "solid-stone" },
    { name: "Fruit blend", className: "fruit-blend" },
  ];
  const conicColors = [
    { name: "True Sunset", className: "true-sunset" },
    { name: "Ripe Malinka", className: "ripe-malinka" },
    { name: "Deep Blue", className: "deep-blue" },
    { name: "Night Fade", className: "night-fade" },
  ];

  const auroraColors = [
    { name: "Fabled Sunset", className: "fabled-sunset" },
    { name: "Red Salvation", className: "red-salvation" },
    { name: "Le Cocktail", className: "le-cocktail" },
    { name: "Shy Rainbow", className: "shy-rainbow" },
  ];

  const tabs = ["Conic Gradient", "Animated Linear", "Aurora Radial"];

  return (
    <div className="w-full grid grid-cols-5 gap-6 pt-10">
      <div
        className={`col-span-3 bg-[#272727] h-72 rounded-4xl overflow-hidden`}
      >
        <div className={`${color} animate-gradient h-full w-full`}></div>
      </div>
      <div className="h-[calc(100vh-350px)] overflow-y-hidden col-span-2">
        <Card className="h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal size={16} color="#9fa0c3" />
              Style Settings
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="h-full flex flex-col justify-between">
            <Tabs
              defaultValue="Animated Linear"
              className="flex flex-col h-full justify-between gap-5"
            >
              <Label htmlFor="gradient-mode">Gradient Mode</Label>
              <TabsList variant="line" className="bg-transparent p-0 flex">
                {tabs.map((item, index) => (
                  <TabsTrigger value={item} key={index}>
                    {item}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Separator />
              <TabsContent
                value="Conic Gradient"
                className="h-full bg-transparent flex flex-col gap-3"
              >
                <Label>Preset Themes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {conicColors.map((preset, index) => (
                    <Button
                      key={index}
                      onClick={() => setColor(preset.className)}
                      variant={color === preset.className ? "default" : "ghost"}
                      className={`w-full ${preset.className}`}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent
                value="Animated Linear"
                className="bg-transparent flex flex-col gap-3"
              >
                <Label>Preset Themes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {linearColors.map((preset, index) => (
                    <Button
                      key={index}
                      onClick={() => setColor(preset.className)}
                      variant={color === preset.className ? "default" : "ghost"}
                      className={`w-full ${preset.className}`}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent
                value="Aurora Radial"
                className="bg-transparent flex flex-col gap-3"
              >
                <Label>Preset Themes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {auroraColors.map((preset, index) => (
                    <Button
                      key={index}
                      onClick={() => setColor(preset.className)}
                      variant={color === preset.className ? "default" : "ghost"}
                      className={`w-full ${preset.className} animate-none!`}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex flex-col gap-2"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
