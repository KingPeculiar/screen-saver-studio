import React from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './screens/index';
import { ThemeProvider } from './components/theme-provider';
import {TitleBar}  from "./components/title-bar"
// import TitleBar from './components/title-bar';

const handleSearch = (query: string) => {
    console.log('App search query executed:', query);
  };

const root = createRoot(document.body);
root.render(
  <>
    <TitleBar title="My Workspace" onSearch={handleSearch} />
    <ThemeProvider storageKey="vite-ui-theme" defaultTheme="system">
      <HomePage />
    </ThemeProvider>
  </>
);
