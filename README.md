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

### 2. Supabase Setup (Automatic)

The application now includes **automatic database setup**! Here's how it works:

#### Option A: Automatic Setup (Recommended)
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Start the application - **the database will be set up automatically!**

#### Option B: Manual Setup (If needed)
1. Follow steps 1-3 above
2. Go to SQL Editor in your Supabase dashboard
3. Run the migration from `supabase/migrations/20250913094918_ancient_torch.sql`

### 3. Run the Application

```bash
npm run dev
```

### 4. Database Status

The application includes a **Database Status Widget** that:
- ✅ **Automatically detects** if your database needs setup
- 🔧 **One-click setup** button when needed
- 📊 **Real-time status** indicators for connection, tables, and setup
- 🔄 **Auto-retry** functionality for failed connections

If you see the database status widget in the bottom-right corner, simply click "Setup Database" for automatic configuration!

## Architecture

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auto-Setup**: Intelligent database initialization system
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
- **Automatic Setup**: Zero-configuration database initialization
- **Smart Detection**: Automatically detects existing setups
- **Real-time Subscriptions**: Live updates across all clients
- **JSONB Support**: Flexible metadata storage
- **Full-text Search**: Location and trip search capabilities
- **Audit Trails**: Created/updated timestamps on all records
- **Error Recovery**: Graceful handling of setup failures
- **Status Monitoring**: Real-time database health indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the migration on your Supabase instance
5. Test your changes
6. Submit a pull request

## License

MIT License - see LICENSE file for details