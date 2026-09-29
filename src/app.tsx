import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./screens/index";
import { ThemeProvider } from "./components/theme-provider";
import { TitleBar } from "./components/title-bar";
import { createHashRouter, RouterProvider, Link } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/settings",
    element: (
      <div>
        <h1>Settings Page</h1>
        <Link to="/">Go Home</Link>
      </div>
    ),
  },
]);

const root = createRoot(document.body);
root.render(
  <>
    <TitleBar title="My Workspace" />
    <ThemeProvider storageKey="vite-ui-theme" defaultTheme="system">
      <RouterProvider router={router} />
    </ThemeProvider>
  </>,
);
