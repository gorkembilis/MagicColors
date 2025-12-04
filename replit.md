# MagicColors - AI Coloring Pages for Kids

## Overview

MagicColors is a web application that allows users to create custom AI-generated coloring pages for children. The application provides both curated coloring page packs and an AI-powered generator that creates unique, child-friendly line-art images based on user prompts. Users can browse pre-made packs, generate custom pages, save their creations to a gallery, and print or download PDFs.

The application features a mobile-first design optimized for parents and children, with internationalization support (English/Turkish), a premium tier system, and Replit authentication integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)

**UI Component System**
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- Custom theme with playful, child-friendly colors (hot pink primary, sunny yellow secondary, sky blue accent)
- **Framer Motion** for animations and transitions
- Mobile-first responsive design with bottom navigation

**State Management**
- **TanStack Query (React Query)** for server state management
- Local component state with React hooks
- Custom `useAuth` hook for authentication state

**Form Handling**
- **React Hook Form** with Zod validation via `@hookform/resolvers`

**Internationalization**
- Custom i18n context provider supporting English and Turkish
- Translation keys stored in `client/src/lib/i18n.tsx`

**Routing Structure**
- `/` - Home page with hero, prompt input, and pack previews
- `/generate` - AI generation page with loading states and result display
- `/pack/:id` - Pack detail page showing all images in a collection
- `/view/:id` - Individual image view with print/download options
- `/gallery` - User's saved AI-generated images
- `/premium` - Premium tier upsell page

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript running on Node.js
- HTTP server created with native `http.createServer`
- Custom logging middleware for request tracking

**Development vs Production**
- Development: Vite dev server integrated via middleware for HMR
- Production: Static file serving from compiled `dist/public` directory
- Build process bundles server code with esbuild for faster cold starts

**Authentication & Session Management**
- **Replit Auth** via OpenID Connect (OIDC) with Passport.js
- **Express Session** with PostgreSQL session store (`connect-pg-simple`)
- Session TTL: 7 days with HTTP-only, secure cookies
- Custom `isAuthenticated` middleware for protected routes

**API Endpoints**
- `GET /api/auth/user` - Fetch authenticated user profile
- `POST /api/generate` - Generate AI coloring page from prompt
- `GET /api/my-art` - Retrieve user's generated images
- Authentication flow handled via Replit OIDC integration

**Storage Layer**
- `DatabaseStorage` class implementing `IStorage` interface
- Methods for user management and image tracking
- All database operations use Drizzle ORM

### Database Architecture

**ORM & Migrations**
- **Drizzle ORM** with PostgreSQL dialect
- Schema defined in `shared/schema.ts` for type sharing between client/server
- **Drizzle Kit** for migrations (output to `./migrations`)
- **Zod schemas** generated from Drizzle tables via `drizzle-zod`

**Database Tables**

1. **sessions** - Express session storage
   - `sid` (primary key)
   - `sess` (JSONB session data)
   - `expire` (timestamp with index for cleanup)

2. **users** - User profiles from Replit Auth
   - `id` (UUID primary key)
   - `email`, `firstName`, `lastName`, `profileImageUrl`
   - `isPremium` (boolean, default false)
   - `premiumUntil` (timestamp)
   - `createdAt`, `updatedAt` timestamps

3. **generatedImages** - AI-generated coloring pages
   - `id` (serial primary key)
   - `userId` (foreign key to users, cascade delete)
   - `prompt` (text)
   - `imageUrl` (text - base64 data URI)
   - `createdAt` timestamp

**Type Safety**
- Shared types exported from schema: `User`, `GeneratedImage`, `UpsertUser`, `InsertUser`
- Zod validation schemas for insert operations

### AI Integration

**Image Generation**
- **Google Gemini API** (`@google/genai`) via `gemini-2.5-flash-image` model
- Custom prompt engineering for child-friendly line-art
- Configuration:
  - Bold outlines suitable for coloring
  - Simple shapes for children
  - No shading/gradients, only black lines on white background
- Returns base64-encoded images as data URIs
- Images stored directly in database (not file storage)

**Environment Configuration**
- `AI_INTEGRATIONS_GEMINI_API_KEY` - API authentication
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Custom endpoint support

### Mock Data & Assets

**Static Packs**
- Pre-generated coloring packs stored in `client/src/lib/mock-data.ts`
- Pack categories: Animals, Cars, Fruits, Dinosaurs, Princess, Space
- Each pack contains 10 images with titles and IDs
- Images stored in `attached_assets/generated_images/` directory
- Premium packs require subscription to unlock

## External Dependencies

### Third-Party Services

1. **Replit Platform**
   - OIDC authentication (`ISSUER_URL`, `REPL_ID`)
   - Deployment environment detection
   - Session secret management (`SESSION_SECRET`)
   - Vite plugins for development: cartographer, dev-banner, runtime-error-modal

2. **Google Gemini AI**
   - Generative AI API for image creation
   - Multimodal output (text + image)
   - Environment: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`

3. **PostgreSQL Database**
   - Connection via `DATABASE_URL` environment variable
   - Used for user data, sessions, and generated images
   - Connection pooling with `pg` library

### Key NPM Dependencies

**Runtime Dependencies**
- `@google/genai` - Google Gemini AI SDK
- `drizzle-orm` - Type-safe ORM
- `express` - Web server framework
- `passport`, `openid-client` - Authentication
- `pg` - PostgreSQL client
- `zod` - Schema validation
- `@tanstack/react-query` - Server state management
- `wouter` - Routing
- `framer-motion` - Animations
- `react-hook-form` - Form management

**UI Component Libraries**
- `@radix-ui/*` - Headless UI primitives (40+ components)
- `tailwindcss` - Utility-first CSS
- `class-variance-authority`, `clsx` - Component variants and className utilities

**Development Tools**
- `vite` - Build tool and dev server
- `tsx` - TypeScript execution
- `esbuild` - Server bundler
- `drizzle-kit` - Database migrations

### Build & Deployment

**Scripts**
- `dev` - Development server with tsx watch mode
- `dev:client` - Vite dev server on port 5000
- `build` - Production build (client + server)
- `start` - Production server from compiled bundle
- `db:push` - Push schema changes to database

**Build Process**
1. Client built with Vite to `dist/public`
2. Server bundled with esbuild to `dist/index.cjs`
3. Allowlisted dependencies bundled into server to reduce syscalls
4. Static assets served from compiled output in production

**Environment Variables Required**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session encryption key
- `ISSUER_URL` - Replit OIDC issuer
- `REPL_ID` - Replit application ID
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini API key
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini API endpoint
- `NODE_ENV` - Environment flag (development/production)