# 🤖 RoboRally Frontend

A modern, cyberpunk-themed frontend application for the RoboRally game built with Next.js 15, featuring a futuristic neon industrial design system and cutting-edge web technologies.

![RoboRally](https://img.shields.io/badge/Game-RoboRally-neon?style=for-the-badge&logo=robot&logoColor=cyan)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-V4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🎮 About RoboRally

RoboRally is an interactive robot programming game where pilots command their robots through factory floors filled with obstacles, conveyor belts, and hazards. This frontend provides a cyberpunk-themed interface for managing games, players, and robot commands.

## ⚡ Key Features

- **🎨 Cyberpunk Design System**: Neon colors, glass panels, and futuristic animations
- **🤖 Gaming-Themed UI**: Robot-inspired components with industrial aesthetics
- **⚡ Real-time Updates**: Live game state management and notifications
- **🔐 Authentication**: Secure pilot registration and login system
- **📱 Responsive Design**: Optimized for desktop and mobile gaming
- **🎯 Type Safety**: Full TypeScript implementation with strict typing
- **🚀 Modern Architecture**: Clean code structure with best practices

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 18** - UI library with modern hooks
- **TypeScript** - Static type checking

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS with latest features
- **shadcn/ui** - High-quality accessible component library
- **Framer Motion** - Smooth animations and transitions
- **Lucide Icons** - Beautiful icon library

### State Management

- **Redux Toolkit** - Predictable state container
- **RTK Query** - Data fetching and caching solution

### Form Management

- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **tw-animate-css** - Additional Tailwind animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd roborally-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your backend API endpoints and other environment variables.

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout with providers
│   └── login/            # Authentication pages
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ElectricBorder/   # Custom components
├── modules/              # Feature-based modules
│   ├── auth/            # Authentication components
│   └── Signup/          # User registration
├── redux/               # State management
│   ├── store.ts        # Redux store configuration
│   └── api/            # RTK Query API endpoints
├── lib/                 # Utility functions
│   └── error-handler.ts # Error handling system
└── hooks/              # Custom React hooks
```

## 🎨 Design System

The RoboRally frontend features a custom cyberpunk design system with:

- **Neon Color Palette**: Teal, magenta, blue, and lime accents
- **Glass Morphism**: Translucent panels with backdrop blur
- **Industrial Typography**: Tomorrow font family
- **Glow Effects**: Dynamic shadows and animations
- **Circuit Patterns**: Futuristic background textures

## 🔧 Development

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript compiler
```

### Code Style

This project follows strict TypeScript and ESLint configurations. Make sure to:

- Use TypeScript for all new files
- Follow the established naming conventions
- Write meaningful commit messages
- Test your changes across different screen sizes

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - Detailed system architecture
- [Component Library](./docs/components.md) - UI component documentation
- [API Integration](./docs/api.md) - Backend integration guide
- [Deployment Guide](./docs/deployment.md) - Production deployment

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **shadcn** for the beautiful component library
- **Tailwind CSS** for the utility-first approach
- **Vercel** for the deployment platform

---

Built with ⚡ for the future of robot gaming 🤖
