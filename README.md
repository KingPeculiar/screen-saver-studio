
# Screen Saver Studio

A polished, cross-platform Electron application for custom desktop wallpaper and screensaver management, built with Electron Forge, Vite, React, TypeScript, Tailwind CSS, and `electron-store`.


## Features

- **Frameless Custom UI**: Sleek, custom-built title bar with drag regions and window controls.
- **Asset Management & Imports**: Organize and preview wallpapers across custom categorized tabs with local asset storage via IPC and preview generation.
- **Live Clock Widget**: Digital and analog clock components featuring real-time updates, format toggles (12-hour/24-hour), and state persistence via `electron-store`.
- **Dynamic Fullscreen Screensaver Dispatcher**: Seamlessly transitions the application into a borderless, top-most full-screen mode based on user-selected preferences (Wallpaper slideshow, Live Clock, or Dynamic Gradient).
- **Auto-Updates**: Integrated support for seamless application updates using `electron-updater` and GitHub Releases.


## Tech Stack

**Framework:** Electron, Electron-forge

**Frontend:** React, Typescript, Tailwind CSS, Lucide Icons

**Bundler:** Vite

**State Persistence:** `electron-store`

## Get Started
**Prerequisites**

Make sure you have Node.js installed on your system.

### Installation
Clone the repository:

```bash
git clone https://github.com/KingPeculiar/screen-saver-studio.git
cd screen-saver-studio
```

Install dependacy

```bash
npm Install
```

Run the app in development mode:

```bash
npm start
```
    
## Building & Packaging

To package the application and generate distributables for your operating system:

```bash
  npm run make
```


## Contributing

Contributions are always welcome! Whether it's reporting a bug, improving documentation, or proposing new features, here is how you can help:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more details.