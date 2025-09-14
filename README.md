# Journai - Travel Orchestration Platform

A comprehensive travel planning and management platform built with React, TypeScript, and Supabase.

## Features

- **AI-Powered Trip Planning**: Automatic itinerary generation with day-by-day activities
- **Integrated Booking System**: Search and book flights, hotels, and activities
- **Real-time Updates**: Live notifications for delays, cancellations, and recommendations
- **Expense Sharing**: Splitwise-like functionality for group travel expenses
- **Navigation & Routing**: Turn-by-turn directions with traffic updates
- **Trip Collaboration**: Share trips and collaborate with travel companions
- **Offline Support**: Download trips for offline access

## Database Schema

The application uses Supabase with the following core tables:

- **users**: User profiles with preferences and settings
- **trips**: Trip information and metadata
- **itinerary_days**: Daily trip organization
- **itinerary_items**: Individual trip activities and bookings
- **bookings**: All booking records with provider details
- **locations**: Geographic locations with coordinates
- **route_legs**: Transportation routes between locations
- **notifications**: User notifications and alerts
- **expense_shares**: Expense splitting functionality

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd journai
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration from `supabase/migrations/create_travel_schema.sql`
3. Get your project URL and anon key from Settings → API
4. Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Console (optional)
VITE_ADMIN_ENABLED=true
VITE_ADMIN_DEBUG=true
VITE_ADMIN_EMAILS=admin@journai.com
```

### 3. Run the Application

```bash
npm run dev
```

## Architecture

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Real-time**: Supabase real-time subscriptions
- **State Management**: React Context API
- **Icons**: Lucide React

## Key Components

- **AuthPage**: User and vendor registration/login
- **Dashboard**: Main trip overview and management
- **TripCreator**: Multi-step trip creation wizard
- **ExpenseSharing**: Splitwise-like expense management
- **BookingHub**: Integrated booking system
- **NavigationMap**: Real-time navigation and routing

## Database Features

- **Row Level Security**: Secure data access policies
- **Real-time Subscriptions**: Live updates across all clients
- **JSONB Support**: Flexible metadata storage
- **Full-text Search**: Location and trip search capabilities
- **Audit Trails**: Created/updated timestamps on all records

## Admin Console

The application includes a hidden administrative console that can be enabled during build time:

### Configuration

Set environment variables to control admin access:

```env
VITE_ADMIN_ENABLED=true          # Enable/disable admin console
VITE_ADMIN_DEBUG=true            # Enable debug mode
VITE_ADMIN_DB_ACCESS=true        # Enable database admin features
VITE_ADMIN_EMAILS=admin@journai.com,super@journai.com  # Admin user emails
```

### Features

- **User Management**: View and manage user accounts
- **System Analytics**: Monitor usage and performance
- **Health Monitoring**: Track system status and uptime
- **Database Administration**: Advanced database operations (restricted)
- **Real-time Stats**: Live system metrics and activity

### Access Control

- Only users with emails listed in `VITE_ADMIN_EMAILS` can access
- Admin tab is hidden from regular users
- Features can be individually enabled/disabled
- Automatic detection in development mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the migration on your Supabase instance
5. Test your changes
6. Submit a pull request

## License

MIT License - see LICENSE file for details