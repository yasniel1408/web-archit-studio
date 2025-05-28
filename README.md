# ArchitStudio - Professional C4 & Cloud Architecture Diagramming Tool

<div align="center">
  <img src="public/logo.png" alt="ArchitStudio Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
</div>

## 📋 Overview

ArchitStudio is a professional SaaS application for creating cloud architecture diagrams (AWS, GCP) and C4 models. Built with Next.js 15 and React, it provides an intuitive interface for designing detailed architecture diagrams with real-time collaboration capabilities.

## ✨ Features

- **🎨 Modern Design System** - Professional UI with light/dark mode support
- **☁️ Cloud Architecture Support** - AWS and GCP service icons and patterns
- **🏗️ C4 Model Diagramming** - Complete C4 model support (Context, Container, Component, Code)
- **🖱️ Interactive Canvas** - Drag-and-drop interface with smooth animations
- **🔗 Smart Connectors** - Animated connection system with customizable styles
- **🔄 Real-time Collaboration** - Work together with your team (coming soon)
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices
- **💾 Export Options** - Export as PNG, SVG, or JSON (coming soon)
- **⚡ Performance Optimized** - Built with performance in mind

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/architstudio.git
cd architstudio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
architstudio/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   │   ├── atoms/        # Basic UI components
│   │   ├── molecules/    # Composite components
│   │   └── organisms/    # Complex components
│   ├── styles/           # Global styles
│   └── page.tsx          # Main page
├── public/               # Static assets
├── lib/                  # Utility functions
└── types/               # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Canvas Rendering:** HTML5 Canvas API

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests (coming soon)
npm run test:e2e     # Run E2E tests (coming soon)

# Type checking
npm run type-check   # Run TypeScript compiler check
```

## 🎯 Roadmap

- [x] Basic drag-and-drop functionality
- [x] AWS service icons
- [x] GCP service icons
- [x] C4 model shapes
- [x] Connection system
- [x] Dark mode support
- [ ] Real-time collaboration
- [ ] Export functionality (PNG, SVG, JSON)
- [ ] Templates library
- [ ] Version control for diagrams
- [ ] Team workspaces
- [ ] API for integrations
- [ ] Mobile app

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by AWS and Google Cloud
- C4 model by Simon Brown
- Built with Next.js and React

## 📞 Support

- 📧 Email: support@architstudio.com
- 💬 Discord: [Join our community](https://discord.gg/architstudio)
- 📚 Documentation: [docs.architstudio.com](https://docs.architstudio.com)

---

<div align="center">
  Made with ❤️ by the ArchitStudio Team
</div>
