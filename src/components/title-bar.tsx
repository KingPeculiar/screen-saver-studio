import React, { useState, useEffect, useRef } from 'react';
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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const toggleMenu = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <header id="title-bar">
      {/* Left Region: Logo & Interactive Dropdown Menus */}
      <div className="title-bar-left">
        <div className="app-icon">⚡</div>

        <nav className="menu-bar">
          {/* File Menu */}
          <div className="menu-item">
            <button
              className={`menu-btn ${activeMenu === 'file' ? 'active' : ''}`}
              onClick={() => toggleMenu('file')}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="dropdown-content">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActiveMenu(null);
                    console.log('New Window');
                  }}
                >
                  New Window
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item"
                  onClick={() => window.electronAPI.closeWindow()}
                >
                  Exit
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="menu-item">
            <button
              className={`menu-btn ${activeMenu === 'edit' ? 'active' : ''}`}
              onClick={() => toggleMenu('edit')}
            >
              Edit
            </button>
            {activeMenu === 'edit' && (
              <div className="dropdown-content">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActiveMenu(null);
                    console.log('Undo');
                  }}
                >
                  Undo
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActiveMenu(null);
                    console.log('Redo');
                  }}
                >
                  Redo
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Center Region: Interactive Search Input */}
      <div className="title-bar-center">
        <div className="search-box">
          <svg
            className="search-icon"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            className="title-search"
            placeholder={`${title} - Search (Ctrl+K)`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {/* Right Region: Non-draggable Window Control Buttons */}
      <div className="title-bar-right">
        <div className="window-controls">
          <button
            className="control-btn"
            aria-label="Minimize"
            onClick={() => {
              window.electronAPI.minimizeWindow();
              setActiveMenu(null);
            }}
          >
            &#8212;
          </button>
          <button
            className="control-btn"
            aria-label="Maximize"
            onClick={() => {
              window.electronAPI.maximizeWindow();
              setActiveMenu(null);
            }}
          >
            {isMaximized ? (
                        /* Restore Icon (overlapping squares) */
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
                          <path d="M3.5 1.5h5v5h-5z" />
                          <path d="M1.5 3.5v5h5" />
                        </svg>
                      ) : (
                        /* Maximize Icon (single square) */
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
                          <rect x="1.5" y="1.5" width="7" height="7" />
                        </svg>
                      )}
          </button>
          <button
            className="control-btn close-btn"
            aria-label="Close"
            onClick={() => {
              window.electronAPI.closeWindow();
              setActiveMenu(null);
            }}
          >
            &#10005;
          </button>
        </div>
      </div>
    </header>
  );
};
