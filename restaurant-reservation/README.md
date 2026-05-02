# SERVOS - Restaurant Reservation System

A modern web-based restaurant reservation management system built with Next.js 14+, migrated from a Java Swing desktop application.

## Features

- **User Authentication**: Secure login and registration with password hashing
- **Table Management**: Visual floor plan with 15 tables and real-time status tracking
- **Reservation System**: Create, view, and manage customer reservations
- **Waitlist Management**: Handle walk-in customers and queue management
- **Customer History**: Track completed reservations
- **Deleted Reservations**: View and restore cancelled reservations
- **Real-time Updates**: Automatic status updates based on arrival/departure times

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Authentication**: iron-session + bcrypt
- **Validation**: Zod
- **Date/Time**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database (existing `servos` database from Java application)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env.local` and update with your database credentials:

```env
DB_HOST=127.0.0.1
DB_PORT=3308
DB_NAME=servos
DB_USER=root
DB_PASSWORD=

SESSION_SECRET=your-secret-key-here-change-in-production-min-32-chars
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
restaurant-reservation/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utility functions and configurations
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database connection
│   ├── validation.ts      # Form validation schemas
│   └── utils.ts           # Helper functions
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
│   └── images/            # Image assets
└── .env.local             # Environment variables (not in git)
```

## Brand Colors

- **Brown**: #5F361D
- **Gold**: #FACF10
- **Cream**: #F6EFBD

## Database Schema

The application uses the existing MySQL database schema from the Java application:

- `user` - Administrator accounts
- `customer_reservation` - Active reservations
- `backup` - Cancelled/deleted reservations

## Development

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Migration Notes

This is a migration from a Java Swing desktop application to a modern web application. The database schema remains unchanged to ensure compatibility during the migration period.

## License

Private - Restaurant Management System
