import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoveLeft, Check } from "lucide-react";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate();

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
        <div>
          <Button className="rounded-2xl" variant="secondary" size="default">
            <Check /> Apply Saver
          </Button>
        </div>
      </div>
      <Separator />
    </header>
  );
}
