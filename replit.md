# NPS Rank - National Parks Voting & Rankings

## Overview

NPS Rank is a full-stack web application that allows users to vote on and rank US National Parks through head-to-head comparisons. The application uses an ELO rating system to maintain dynamic rankings based on user preferences, creating an engaging way to discover and compare America's national parks. Users can participate in matchup voting, view comprehensive rankings, and browse detailed information about all 63 national parks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built with React 18 and TypeScript, utilizing a modern component-based architecture:
- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The server follows a RESTful API design using Express.js:
- **Framework**: Express.js with TypeScript for type-safe server development
- **API Design**: RESTful endpoints for parks, voting, and rankings
- **Data Storage**: In-memory storage with plans for PostgreSQL integration via Drizzle ORM
- **ELO System**: Custom implementation for dynamic park ranking calculations
- **Error Handling**: Centralized error handling middleware

### Database Design
Currently uses in-memory storage with schema prepared for PostgreSQL migration:
- **Parks Table**: Stores park information including name, location, description, images, and ELO ratings
- **Votes Table**: Records all voting history with ELO changes for analytics
- **Schema Management**: Drizzle ORM with PostgreSQL dialect for future database integration

### Key Features
- **Voting System**: Head-to-head park comparisons with ELO rating updates
- **Dynamic Rankings**: Real-time park rankings based on voting outcomes
- **Park Browser**: Comprehensive grid view of all national parks with filtering and sorting
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: Optimistic updates and automatic data refreshing

### Development Workflow
- **Hot Reloading**: Vite development server with React Fast Refresh
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Quality**: ESLint configuration and consistent formatting
- **Build Process**: Separate client and server build pipelines for production deployment

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database (configured but not yet active)
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Connection**: Environment variable-based configuration for DATABASE_URL

### UI Components
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library with Tailwind CSS integration
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **TypeScript**: Full type checking across the application stack

### Third-party Services
- **Unsplash**: External image hosting for national park photography
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight routing solution for single-page application navigation

The application is designed to scale from the current in-memory storage to a full PostgreSQL database deployment while maintaining the same API interface and user experience.