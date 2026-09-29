/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// src/App.tsx or src/renderer.tsx

import "./styles/index.css";
import "./app.tsx";
import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider, Link } from "react-router-dom";
import HomePage from "./screens/index";
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

const root = createRoot(document.getElementById("root")!);

root.render(<RouterProvider router={router} />);
