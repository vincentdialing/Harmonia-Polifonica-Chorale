# Harmonia Polifonica Chorale

A modern, performant web application for the Harmonia Polifonica Chorale, showcasing their achievements, events, and community presence.

## 🎵 About

Harmonia Polifonica Chorale is an award-winning choral group. This website features:
- Event highlights and competition results
- Photo galleries from performances
- Contact and membership information
- Responsive design with smooth animations

## 🚀 Tech Stack

- **Frontend**: React 18.3 + TypeScript 5.5
- **Build Tool**: Vite 6.3 with SWC
- **Routing**: React Router DOM 7.12
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + EmailJS
- **Analytics**: Vercel Analytics & Speed Insights
- **Deployment**: Vercel

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 📁 Project Structure

```
├── public/           # Static assets
│   ├── images/       # Event photos and galleries
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── figma/    # Custom components
│   │   └── ui/       # Radix UI based components
│   ├── styles/       # Global styles
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
└── vite.config.ts    # Vite configuration
```

## 🎨 Key Features

- **Performance Optimized**: Lazy loading, code splitting, and optimized images
- **Responsive Design**: Mobile-first approach with smooth animations
- **Accessibility**: Built with Radix UI for ARIA compliance
- **Dark Mode**: Theme support with next-themes
- **Type Safe**: Full TypeScript coverage

## 📧 Contact Integration

Contact forms are powered by EmailJS. Configure your EmailJS credentials in the environment variables.

## 📄 License

Private - © Harmonia Polifonica Chorale

## 🤝 Contributing

This is a private project for Harmonia Polifonica Chorale.
