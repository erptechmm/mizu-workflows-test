# Git Replace Command

## Overview

This is a React-based web application that generates Git commands for repository replacement. The application allows users to input target and source repository URLs and generates formatted Git command sequences to replace content in repositories. The app features a modern, visually appealing UI with gradient backgrounds and glass-morphism effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark mode)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Development**: tsx for TypeScript execution in development

### Key Components

#### Frontend Components
- **UI Components**: Comprehensive shadcn/ui component library including forms, dialogs, buttons, cards, etc.
- **Routing**: Simple route structure with home page and 404 handling
- **Form Handling**: React Hook Form with Zod validation schemas
- **Notifications**: Toast notifications for user feedback

#### Backend Components
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **User Management**: Basic user schema with authentication structure
- **API Routes**: RESTful API structure with Express.js middleware
- **Development Tooling**: Vite integration for development with HMR support

## Data Flow

1. **User Input**: Users enter target and source repository URLs through form inputs
2. **Validation**: Client-side validation ensures URLs meet minimum length requirements (27+ characters)
3. **Command Generation**: Application processes URLs by removing first 27 characters and generates Git command sequences
4. **Output Display**: Generated commands are displayed in a formatted, copyable text area
5. **User Feedback**: Toast notifications provide success/error feedback to users

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI/Styling**: Tailwind CSS, Radix UI primitives, Lucide React icons
- **Backend**: Express.js, Drizzle ORM, Neon Database driver
- **Development**: Vite, TypeScript, tsx, esbuild
- **Utilities**: date-fns, clsx, class-variance-authority, zod

### Database
- **Primary Database**: PostgreSQL via Neon Database serverless driver
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migrations**: Drizzle Kit for schema migrations
- **Schema Location**: `./shared/schema.ts` with user table definition

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Production Serving**: Express serves static files and API routes

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution with Vite dev server
- **Production**: Compiled JavaScript with Node.js execution
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Scripts
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server execution
- `npm run db:push`: Database schema synchronization

### Architecture Decisions

**Frontend Framework Choice**: React with TypeScript chosen for component reusability and type safety. shadcn/ui provides consistent, accessible UI components.

**Backend Simplicity**: Express.js chosen for simplicity and rapid development. Drizzle ORM provides type-safe database operations without the complexity of heavier ORMs.

**Database Strategy**: PostgreSQL selected for relational data needs. Neon Database provides serverless PostgreSQL with excellent developer experience.

**Build Strategy**: Vite for frontend provides fast development and optimized builds. esbuild for backend ensures fast server compilation.

**Session Management**: PostgreSQL-based sessions chosen for persistence and scalability over in-memory solutions.