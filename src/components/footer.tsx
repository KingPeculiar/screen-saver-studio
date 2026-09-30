import React from "react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="footer typeset typeset-chat border-t border-(--border)">
      <div className="p-2 m-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full animate-pulse bg-emerald-600 block"></span>
            <p className="text-sm">Engine Ready</p>
            <Separator orientation="vertical" />
          </div>
          <p className="text-sm self-end justify-self-end">
            Press ESC to exit fullscreen mode
          </p>
        </div>
      </div>
    </footer>
  );
}
