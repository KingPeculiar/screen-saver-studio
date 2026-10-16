import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { MoveLeft, Check, Play } from "lucide-react";
import {
  useScreenSaver,
  PreferenceType,
} from "../context/screen-saver-context";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate();
  const { applyAndLaunch, setActiveType } = useScreenSaver();

  const prefType = title.toLowerCase() as PreferenceType;

  return (
    <header>
      <div className="flex flex-row justify-between items-center pb-6">
        <div className="flex flex-row gap-4 items-center">
          <Button
            className="rounded-2xl h-10 w-10"
            variant="secondary"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <MoveLeft size={30} />
          </Button>
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-[24px]">
              Pick your {title} Style...
            </h2>
            <p className="text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="rounded-2xl"
            variant="default"
            size="default"
            onClick={() => applyAndLaunch(prefType)}
          >
            <Play className="w-4 h-4 mr-1" /> Launch Preview
          </Button>
          <Button
            className="rounded-2xl"
            variant="secondary"
            size="default"
            onClick={() => setActiveType(prefType)}
          >
            <Check /> Apply Saver
          </Button>
        </div>
      </div>
      <Separator />
    </header>
  );
}
