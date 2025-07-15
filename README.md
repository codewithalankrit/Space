# 🌌 Cosmic Speed Control

A visually rich, interactive 3D Solar System simulation built with React, Vite, Tailwind CSS, and React Three Fiber. Explore the planets, control their orbital speeds, and enjoy a cosmic experience right in your browser!

---

## 🚀 Features

- **3D Solar System**: Realistic orbits, planet sizes, and distances using physically-inspired data.
- **Interactive Controls**:
  - Adjust the orbital speed of each planet with sliders.
  - Pause/resume the entire simulation.
  - Toggle between dark and light cosmic themes.
  - Hover over planets for detailed facts and labels.
  - Drag to rotate, scroll to zoom, and pan the camera.
- **Rich Visuals**:
  - High-quality textures for all planets and the Sun.
  - Animated sun with corona, flares, and prominences.
  - Starfield background and cosmic gradients.
- **Responsive UI**: Modern, accessible controls and layout.
- **404 Page**: Friendly not-found page for unknown routes.

---

## 🖥️ Demo

> _No live demo yet. Clone and run locally!_

---

## 📦 Tech Stack

- [React 18](https://react.dev/) + [TypeScript]
- [Vite](https://vitejs.dev/) (blazing fast dev/build)
- [Tailwind CSS](https://tailwindcss.com/) (custom cosmic theme)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (3D rendering)
- [@react-three/drei](https://github.com/pmndrs/drei) (3D helpers)
- [@tanstack/react-query](https://tanstack.com/query/latest) (state management)
- [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) (UI components)

---

## 📁 Folder Structure

```
cosmic-speed-control-main/
├── public/                # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── assets/            # Planet and sun textures (JPG)
│   ├── components/
│   │   ├── SolarSystem.tsx  # Main 3D simulation
│   │   └── ui/              # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   ├── pages/             # App pages (Index, NotFound)
│   ├── App.tsx            # App root
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind cosmic theme
├── index.html             # HTML entry
├── tailwind.config.ts     # Tailwind config
├── package.json           # Project metadata & scripts
└── ...
```

---

## 🛠️ Installation & Usage

1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd cosmic-speed-control-main
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   bun install
   ```
3. **Start the dev server:**
   ```sh
   npm run dev
   # or
   bun run dev
   ```
4. **Open in browser:**
   Visit [http://localhost:8080](http://localhost:8080)

---

## 🎮 Controls

- **Rotate:** Click and drag the scene
- **Zoom:** Scroll wheel
- **Pan:** Right-click drag or two-finger drag
- **Pause/Resume:** Button in top-right
- **Adjust Speeds:** Sliders in control panel
- **Theme Toggle:** Sun/Moon switch in header
- **Planet Info:** Hover over a planet

---

## 📝 Credits

- **Textures:** NASA/JPL (public domain) or generated
- **3D Engine:** [three.js](https://threejs.org/) via React Three Fiber
- **UI:** [shadcn/ui], [Radix UI], [Lucide Icons]

---

## 📄 License

MIT (see `LICENSE` if present)
