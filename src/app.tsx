import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./screens/index";
import Wallpaper from "./screens/wallpaper";
import { ThemeProvider } from "./components/theme-provider";
import { TitleBar } from "./components/title-bar";
import { createHashRouter, RouterProvider, Link } from "react-router-dom";
import Footer from "./components/footer";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/wallpaper",
    element: <Wallpaper />,
  },
]);

const root = createRoot(document.body);
root.render(
  <>
    <ThemeProvider storageKey="vite-ui-theme" defaultTheme="system">
      <div className="m-auto typeset typeset-chat">
        <TitleBar title="My Workspace" />
        <div className="m-auto typeset typeset-chat h-screen overflow-y-auto">
          <RouterProvider router={router} />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  </>,
);
