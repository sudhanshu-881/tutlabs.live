# tutlabs.live

A location-based educational platform that connects tutors with parents/students within a defined geographic radius.

## Overview

tutlabs enables tutors to create detailed profiles showcasing their qualifications, experience, and availability, while parents can browse nearby tutors or post tutoring requirements. The platform includes direct messaging capabilities for seamless communication between parties.

## Features
- **User Authentication**: Secure registration and login for tutors and parents
- **Tutor Profiles**: Comprehensive profiles including education, experience, subjects, hourly rates, and availability
- **Location-Based Search**: Find tutors within a 10-mile radius using geographic coordinates
- **Requirement Posting**: Parents can post tutoring needs for tutors to discover
- **Direct Messaging**: Built-in messaging system for communication between users
- **Dark/Light Mode**: Fully responsive design with theme support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and optimized builds
- Wouter for lightweight routing
- TanStack Query (React Query) for server state management
- shadcn/ui component library built on Radix UI
- Tailwind CSS for styling

### Backend
- Express.js with TypeScript
- PostgreSQL via Neon serverless driver
- Drizzle ORM for type-safe database queries
- bcrypt for password hashing
- Session-based authentication

### Key Libraries
- Zod for schema validation
- React Hook Form for form handling
- Lucide React for icons
- date-fns for date manipulation

## Database Schema

### Users Table
- User authentication and identification
- Email, hashed password, role (tutor/parent), name

### Tutor Profiles Table
- Education and experience details
- Subjects array, hourly rate
- Geographic coordinates (latitude, longitude)
- Weekly availability (boolean fields for each day)
- Bio and profile information

### Parent Profiles Table
- Parent location data for radius-based matching

### Requirements Table
- Parent-posted tutoring needs
- Subject, description, reference to parent profile

### Messages Table
- Direct messaging between users
- Sender/recipient relationships

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database (Neon recommended)

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd tutlabs.live
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

Create a `.env` file in the root directory with:

```bash
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

Run database migrations:

```bash
npm run db:push
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (client) with API proxied to `http://localhost:5000`.

## Available Scripts
- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## API Endpoints (initial placeholders)

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user (TBD)
- GET `/api/auth/user` - Get current user (TBD)

### Tutor Profiles
- GET `/api/tutors/profile/:userId` - Get tutor profile (TBD)
- POST `/api/tutors/profile` - Create/update tutor profile (TBD)
- GET `/api/tutors/nearby` - Find nearby tutors (TBD)

### Parent Profiles
- GET `/api/parents/profile/:userId` - Get parent profile (TBD)
- POST `/api/parents/profile` - Create/update parent profile (TBD)

### Requirements
- GET `/api/requirements` - Get all requirements (TBD)
- POST `/api/requirements` - Create requirement (TBD)

### Messages
- GET `/api/messages` - Get user messages (TBD)
- POST `/api/messages` - Send message (TBD)

## Design System
The platform follows a hybrid design approach combining:

- **Airbnb**: Trust-building patterns for location-based services
- **LinkedIn**: Professional aesthetics for educational credibility

### Color Palette
- **Primary**: Education-focused blue tones
- **Accent**: Complementary colors for CTAs
- **Background**: Clean, professional light/dark themes

See `design_guidelines.md` for complete design documentation.

## Geographic Features
- Location data stored as latitude/longitude with high precision (10,7)
- City text field for human-readable location display
- Distance calculations for 10-mile radius matching
- Geographic queries for nearby tutor search

## Development Philosophy
- **Schema-first**: Define data model before implementation
- **Type safety**: TypeScript throughout frontend and backend
- **Shared validation**: Zod schemas derived from Drizzle tables
- **Minimal files**: Collapse similar components where possible
- **Frontend-heavy**: Backend only handles data persistence and API calls
