# MagicColors - AI Coloring Pages for Kids

## Overview

MagicColors is a web application that allows users to create custom AI-generated coloring pages for children. The application provides both curated coloring page packs and an AI-powered generator that creates unique, child-friendly line-art images based on user prompts. Users can browse pre-made packs, generate custom pages, save their creations to a gallery, and print or download PDFs.

The application features a mobile-first design optimized for parents and children, with internationalization support (English/Turkish), a premium tier system, and in-app email/password authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Profile & Favorites System** (December 2024):
  - **Profile Page**: User profile at `/profile` with stats, achievements, and favorites gallery
  - **Favorites System**: Heart button to save favorite coloring pages to user profile
  - **Profile Navigation**: Added profile button to bottom navigation menu
  - **Achievements**: Gamification with 3 unlockable achievements (First Artwork, Color Master, Collector)
  - **Logout Functionality**: Added logout function to authentication system
- **New Features** (December 2024):
  - **Onboarding Flow**: 4-slide intro tutorial for first-time users (`/onboarding`)
  - **Digital Coloring**: Interactive canvas for coloring pages with touch/mouse support (`/coloring/:id`)
  - **New Packs**: Added Sea Creatures, Birds, Sports, and Music coloring packs
  - **Social Sharing**: Native share API integration for sharing colored images
  - **Settings Page**: Notification preferences and language settings (`/settings`)
- **Admin Dashboard** (December 2024): Added comprehensive admin panel at `/admin` for managing users, viewing statistics, and managing generated images
- **Promo Code System** (December 2024):
  - Admin panel "Codes" tab for creating/managing promo codes with max uses, expiry dates, and premium days
  - User promo code redemption on premium page with atomic transaction-based validation
  - Database tables: `promo_codes` and `promo_code_redemptions` with unique constraint on (userId, promoCodeId)
  - Automatic premium status update on successful code redemption
- **Admin Panel Separation** (December 2024):
  - Admin panel moved to secret URL: `/mc-management-2024` (not visible in app navigation)
  - Only accessible by users with admin role who know the direct URL
  - Completely separate from the main user-facing application
- **In-App Authentication** (December 2024): Replaced Replit Auth with custom email/password authentication system to avoid external redirects

## Pending Integrations

- **Stripe Payments**: Payment system UI is ready but Stripe integration not yet connected. When ready:
  1. Set up Stripe integration via Replit's integration system
  2. Add payment endpoints to `server/routes.ts`
  3. Connect purchase flow in `client/src/pages/premium.tsx`

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
- `/onboarding` - First-time user tutorial (4 slides)
- `/auth` - Login and registration page
- `/generate` - AI generation page with loading states and result display
- `/pack/:id` - Pack detail page showing all images in a collection
- `/view/:id` - Individual image view with print/download/color options
- `/coloring/:id` - Digital coloring canvas with touch support
- `/gallery` - User's saved AI-generated images
- `/settings` - Notification preferences and language settings
- `/premium` - Premium tier upsell page
- `/admin` - Admin dashboard (requires admin role)

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
- **Custom email/password authentication** with bcrypt password hashing
- **Express Session** with PostgreSQL session store (`connect-pg-simple`)
- Session TTL: 7 days with HTTP-only, secure cookies
- Custom `isAuthenticated` middleware for protected routes
- Custom `isAdmin` middleware for admin-only routes

**API Endpoints**
- `POST /api/auth/register` - Register new user with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/user` - Fetch authenticated user profile
- `POST /api/generate` - Generate AI coloring page from prompt
- `GET /api/my-art` - Retrieve user's generated images
- **Admin Endpoints:**
  - `GET /api/admin/stats` - Get application statistics
  - `GET /api/admin/users` - List all users
  - `PATCH /api/admin/users/:id` - Update user (premium/admin status)
  - `DELETE /api/admin/users/:id` - Delete user
  - `GET /api/admin/images` - List all generated images
  - `DELETE /api/admin/images/:id` - Delete image

**Storage Layer**
- `DatabaseStorage` class implementing `IStorage` interface
- Methods for user management, image tracking, and admin operations
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

2. **users** - User profiles
   - `id` (UUID primary key)
   - `email` (unique), `passwordHash`
   - `firstName`, `lastName`, `profileImageUrl`
   - `isPremium` (boolean, default false)
   - `isAdmin` (boolean, default false)
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
- Pack categories: Animals, Cars, Fruits, Dinosaurs, Princess, Space, Pokemon-style, Superheroes, Sea Creatures, Birds, Sports, Music
- Each pack contains 10-20 images with titles and IDs
- Images stored in `attached_assets/generated_images/` directory
- Premium packs (Princess, Space, Pokemon, Superheroes, Sports, Music) require subscription to unlock

## External Dependencies

### Third-Party Services

1. **Google Gemini AI**
   - Generative AI API for image creation
   - Multimodal output (text + image)
   - Environment: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`

2. **PostgreSQL Database**
   - Connection via `DATABASE_URL` environment variable
   - Used for user data, sessions, and generated images
   - Connection pooling with `pg` library

### Key NPM Dependencies

**Runtime Dependencies**
- `@google/genai` - Google Gemini AI SDK
- `drizzle-orm` - Type-safe ORM
- `express` - Web server framework
- `bcryptjs` - Password hashing
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
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini API key
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini API endpoint
- `NODE_ENV` - Environment flag (development/production)
