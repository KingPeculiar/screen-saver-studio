import React from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './screens/index';
import { ThemeProvider } from './components/theme-provider';

const root = createRoot(document.body);
root.render(
  <ThemeProvider>
    <HomePage />
  </ThemeProvider>
);
