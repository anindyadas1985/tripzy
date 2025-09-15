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

### 2. Automated Database Setup

#### Option A: Automated Setup (Recommended)

```bash
# Run the automated setup script
npm run setup:gcp
```

This script will:
- Set up Supabase project (local or remote)
- Create Google Cloud SQL instance (if configured)
- Run all database migrations
- Generate environment configuration files
- Set up all required tables and relationships

#### Option B: Manual Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Create a `.env` file:

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

**Note**: The database tables will be created automatically on first run. No manual SQL execution required!

## GCP Deployment

### Prerequisites

1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
2. Install Supabase CLI: `npm install -g supabase`
3. Set up your GCP project and enable billing

### Deployment Steps

```bash
# 1. Setup database and environment
npm run setup:gcp

# 2. Build the application
npm run build

# 3. Deploy to Google App Engine
npm run deploy:gcp
```

### Environment Variables for Production

Set these in your Cloud Build triggers or App Engine environment:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_ENABLED=false  # Disable admin in production
GCP_PROJECT_ID=your-gcp-project-id
SUPABASE_PROJECT_ID=your-supabase-project-id
```

### Database Management Commands

```bash
# Run database migrations
npm run db:migrate

# Reset database (development only)
npm run db:reset

# Setup database from scratch
npm run setup:database
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

- **Automated Setup**: Zero-configuration database initialization
- **Auto-Migration**: Tables created automatically on first run
- **Real-time Subscriptions**: Live updates across all clients
- **Row Level Security**: Secure data access policies
- **JSONB Support**: Flexible metadata storage
- **Full-text Search**: Location and trip search capabilities
- **Audit Trails**: Created/updated timestamps on all records
- **GCP Integration**: Seamless Google Cloud Platform deployment

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