import { useEffect, useState } from "react";
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
import React from "react";

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

function App() {
  const [updateReady, setUpdateReady] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    window.electronAPI.onUpdateAvailable(() => {
      setUpdateAvailable(true);
    });

    window.electronAPI.onUpdateDownloaded(() => {
      setUpdateReady(true);
    });
  }, []);

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

  return (
    <ThemeProvider storageKey="vite-ui-theme" defaultTheme="system">
      {updateReady && (
        <div className="mb-6 p-4 bg-blue-900/40 border border-blue-600 rounded-2xl flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-blue-300">Update Downloaded</h3>
            <p className="text-xs text-gray-300">A new version of ScreenSaver Studio is ready to install.</p>
          </div>
          <button
            onClick={() => window.electronAPI.restartAndInstall()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl cursor-pointer"
          >
            Restart & Install
          </button>
        </div>
      )}

      {updateAvailable && !updateReady && (
        <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-2xl text-xs text-gray-400">
          Downloading background update...
        </div>
      )}
      <ScreenSaverProvider>{screenSaverWindow}</ScreenSaverProvider>
    </ThemeProvider>
  );
}

export default App;