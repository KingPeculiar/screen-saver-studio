import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, X, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button';

import './TitleBar.css';

interface TitleBarProps {
  title?: string;
  onSearch?: (query: string) => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = 'My Electron App',
  onSearch,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Global keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape') {
        setActiveMenu(null);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.menu-item')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
      // 1. Fetch initial state on mount
      window.electronAPI.isWindowMaximized().then((isMaximized) => {
          setIsMaximized(isMaximized);
          console.log('Window maximized state:', isMaximized);
        });

      // 2. Subscribe to window maximize/unmaximize events
      const unsubscribe = window.electronAPI.onMaximizeStateChange((maximized) => {
        setIsMaximized(maximized);
      });

      // 3. Clean up listeners when component unmounts
      return () => {
        unsubscribe();
      };
    }, []);

  return (
    <header id="title-bar">
      <div className="title-bar-left">
        <nav className="menu-bar">
          ScreenSaver studio
        </nav>
      </div>
      <div className="title-bar-center">
        Preferences
      </div>

      {/* Right Region: Non-draggable Window Control Buttons */}
      <div className="title-bar-right">
        <div className="window-controls">
          <Button
            variant="ghost"
            size='icon'
            className="control-btn"
            aria-label="Minimize"
            onClick={() => {
              window.electronAPI.minimizeWindow();
              setActiveMenu(null);
            }}
          >
            <Minus />
          </Button>
          <Button
            variant="ghost"
            size='icon'
            className="control-btn"
            aria-label="Maximize"
            onClick={() => {
              window.electronAPI.maximizeWindow();
              setActiveMenu(null);
            }}
          >
            {isMaximized ? (
            <Minimize2 />
          ) : (
            <Maximize2 />
          )}
          </Button>
          <Button
            variant="ghost"
            size='icon'
            className="control-btn close-btn"
            aria-label="Close"
            onClick={() => {
              window.electronAPI.closeWindow();
              setActiveMenu(null);
            }}
          >
            <X />
          </Button>
        </div>
      </div>
    </header>
  );
};
