# DiceEmpire - 3D Monopoly Game

## Overview

DiceEmpire is a browser-based 3D Monopoly game built with React, Three.js, and Express. The application features a fully interactive 3D game board with custom player pieces, property management, and classic Monopoly gameplay mechanics. Players can roll dice, buy properties, build houses and hotels, trade with other players, and compete to become the wealthiest property owner.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool

**3D Rendering**: 
- React Three Fiber (`@react-three/fiber`) for declarative Three.js integration
- React Three Drei (`@react-three/drei`) for helper components like OrbitControls and Text
- React Three Postprocessing for visual effects
- GLSL shader support via vite-plugin-glsl

**UI Components**: 
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for styling with a custom design system
- shadcn/ui component patterns

**State Management**: 
- Zustand for global state management with middleware support
- Separate stores for game logic (`useMonopoly`), audio (`useAudio`), and general game state (`useGame`)
- Uses `subscribeWithSelector` middleware for granular state subscriptions

**Routing**: 
- Client-side routing (implied by the presence of a not-found page)
- Single-page application architecture

**Design Patterns**:
- Component composition with Radix UI's slot pattern
- Custom hooks for reusable logic (e.g., `useIsMobile`)
- Inline styles for 3D component positioning to avoid CSS-in-JS complexity

### Backend Architecture

**Framework**: Express.js with TypeScript

**Server Structure**:
- Entry point: `server/index.ts`
- Routes defined in `server/routes.ts` (currently minimal, prefixed with `/api`)
- Storage abstraction layer in `server/storage.ts`

**Development Setup**:
- Vite dev server integrated via middleware in development mode
- Custom logging middleware for API requests
- Hot module replacement (HMR) support

**Storage Layer**:
- Interface-based design (`IStorage`) for storage operations
- In-memory implementation (`MemStorage`) for development/testing
- Designed to swap between memory and database implementations without changing application code

**Build Process**:
- Client built with Vite to `dist/public`
- Server bundled with esbuild to `dist/index.js`
- ESM module format throughout

### Data Storage

**ORM**: Drizzle ORM configured for PostgreSQL

**Database Connection**: 
- Neon serverless PostgreSQL (`@neondatabase/serverless`)
- Connection via `DATABASE_URL` environment variable

**Schema**: 
- User authentication schema in `shared/schema.ts`
- Zod validation schemas derived from Drizzle schemas
- Type-safe insert and select operations

**Migration Strategy**:
- Drizzle Kit for schema management
- Push-based migrations (`db:push` script)
- Migrations stored in `./migrations` directory

**Current Implementation**:
- Basic user table with username/password fields
- Schema shared between client and server via path aliases
- Ready for expansion to include game state persistence

### External Dependencies

**3D Graphics**:
- Three.js ecosystem for WebGL rendering
- Custom geometry and materials for game pieces and board
- GLTF/GLB model support for potential asset loading

**Audio System**:
- Native Web Audio API via HTMLAudioElement
- Background music, hit sounds, and success sounds
- Mute/unmute functionality with state persistence

**UI Libraries**:
- Radix UI component primitives (40+ components)
- Lucide React for icons
- Inter font via Fontsource
- Class Variance Authority for component variants
- clsx and tailwind-merge for className management

**Development Tools**:
- TypeScript for type safety across the stack
- tsx for running TypeScript server code
- Vite runtime error overlay plugin
- PostCSS with Tailwind and Autoprefixer

**Data Management**:
- TanStack Query (React Query) for server state management
- date-fns for date manipulation
- Zod for runtime validation

**Session Management**:
- connect-pg-simple for PostgreSQL session store
- Designed for Express session middleware integration

**Asset Handling**:
- Support for 3D models (.gltf, .glb)
- Audio files (.mp3, .ogg, .wav)
- Custom font files (.json format)