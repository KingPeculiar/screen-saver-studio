import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import React from "react";
import { ModeToggle } from "../components/mode-toggle";
import { Badge } from "../components/ui/badge";
import { Image, Clock, WandSparkles, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScreenSaver } from "../context/screen-saver-context";

export default function HomePage() {
  const saver = [
    {
      icon: Image,
      title: "Wallpaper",
      description:
        "Display curated HD photography, anime artwork, landmark views, or custom uploaded wall art.",
    },
    {
      icon: Clock,
      title: "Clock",
      description:
        "Elegant minimal digital clocks, vintage flip clocks, analog faces with weather and status widgets.",
    },
    {
      icon: WandSparkles,
      title: "Gradient",
      description:
        "Fluid dynamic aurora colors, morphing mesh gradients, smooth animated aesthetic hues",
    },
  ];

  const navigate = useNavigate();
  const { activeType } = useScreenSaver();
  const activeSaver = activeType[0].toUpperCase() + activeType.slice(1);

  return (
    <main className="typeset typeset-chat m-auto">
      <header>
        <div className="flex flex-row justify-between items-center pb-4">
          <div className="flex flex-col gap-1">
            <h1>Pick your preference...</h1>
            <p>Choose your screen saver preference below.</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Badge variant="outline" className="h-8 px-4">
              Active: {activeSaver}
            </Badge>
            <ModeToggle />
          </div>
        </div>
        <Separator />
        <div className="my-10 grid grid-cols-3 gap-4">
          {saver.map((s, index) => (
            <Card
              key={index}
              className="flex flex-col gap-4 cursor-pointer"
              onClick={() => navigate(`/${s.title.toLowerCase()}`)}
            >
              <CardHeader className="px-8 py-4">
                <span className="flex flex-row items-center p-4 bg-[#BCF8EC] max-w-max rounded-4xl">
                  <s.icon size={32} color="#000000" />
                </span>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 px-8 py-1">
                <h2>{s.title}</h2>
                <p>{s.description}</p>
              </CardContent>
              <CardFooter className="flex flex-row items-center justify-between px-8 py-4">
                <p className="font-medium">Configure {s.title}</p>
                <Button variant="ghost">
                  <MoveRight />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </header>
    </main>
  );
}
