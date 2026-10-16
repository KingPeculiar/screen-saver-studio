import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./screens/index";
import Wallpaper from "./screens/wallpaper";
import Clock from "./screens/clock";
import Gradient from "./screens/gradient";
import { ThemeProvider } from "./components/theme-provider";
import { TitleBar } from "./components/title-bar";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Footer from "./components/footer";
import { Toaster } from "./components/ui/toast";
import { ScreenSaverProvider } from "./context/screen-saver-context";
import { FullscreenScreenSaver } from "./components/fullscreen-screen-saver";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/wallpaper",
    element: <Wallpaper />,
  },
  {
    path: "/clock",
    element: <Clock />,
  },
  {
    path: "/gradient",
    element: <Gradient />,
  },
]);

const isScreenSaverWindow =
  window.location.hash.split("?")[0] === "#/screensaver";
const screenSaverWindow = isScreenSaverWindow ? (
  <FullscreenScreenSaver />
) : (
  <div className="m-auto typeset typeset-chat">
    <TitleBar title="My Workspace" />
    <div className="m-auto typeset typeset-chat h-[calc(100vh-80px)] overflow-y-auto">
      <RouterProvider router={router} />
    </div>
    <Toaster />
    <Footer />
  </div>
);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Application root element was not found");
}
const root = createRoot(rootElement);
root.render(
  <ThemeProvider storageKey="vite-ui-theme" defaultTheme="system">
    <ScreenSaverProvider>{screenSaverWindow}</ScreenSaverProvider>
  </ThemeProvider>,
);
