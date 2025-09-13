/*
  # Travel Orchestration Platform Database Schema

  1. New Tables
    - `users` - User profiles with preferences and settings
    - `trips` - Trip information and metadata
    - `itinerary_days` - Daily trip organization
    - `itinerary_items` - Individual trip activities and bookings
    - `bookings` - All booking records with provider details
    - `locations` - Geographic locations with coordinates
    - `route_legs` - Transportation routes between locations
    - `notifications` - User notifications and alerts
    - `user_loyalty_programs` - User loyalty program memberships
    - `user_payment_methods` - User payment methods
    - `trip_members` - Trip sharing and collaboration
    - `expense_shares` - Expense splitting functionality

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for trip sharing and collaboration
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  user_type text NOT NULL DEFAULT 'traveler' CHECK (user_type IN ('traveler', 'vendor')),
  preferences jsonb DEFAULT '{}',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User loyalty programs
CREATE TABLE IF NOT EXISTS user_loyalty_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  membership_number text NOT NULL,
  tier text,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User payment methods
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('credit', 'debit', 'paypal', 'apple_pay', 'google_pay')),
  last4 text NOT NULL,
  brand text NOT NULL,
  expiry_month integer NOT NULL,
  expiry_year integer NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lat decimal(10, 8) NOT NULL,
  lon decimal(11, 8) NOT NULL,
  address text,
  city text,
  country text,
  timezone text,
  created_at timestamptz DEFAULT now()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'upcoming', 'active', 'completed', 'cancelled')),
  style text NOT NULL DEFAULT 'leisure' CHECK (style IN ('leisure', 'business', 'family')),
  pace text NOT NULL DEFAULT 'moderate' CHECK (pace IN ('relaxed', 'moderate', 'packed')),
  budget decimal(10, 2) DEFAULT 0,
  spent decimal(10, 2) DEFAULT 0,
  currency text DEFAULT 'INR',
  travelers integer DEFAULT 1,
  preferences text[] DEFAULT '{}',
  image text,
  share_code text UNIQUE,
  is_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trip members (for sharing)
CREATE TABLE IF NOT EXISTS trip_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- Itinerary days
CREATE TABLE IF NOT EXISTS itinerary_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  date date NOT NULL,
  day_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, date)
);

-- Itinerary items
CREATE TABLE IF NOT EXISTS itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id uuid REFERENCES itinerary_days(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('flight', 'train', 'bus', 'hotel', 'activity', 'transport', 'meal', 'break')),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location_id uuid REFERENCES locations(id),
  location_name text,
  cost decimal(10, 2) DEFAULT 0,
  currency text DEFAULT 'INR',
  booking_id uuid,
  status text NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'booked', 'confirmed', 'cancelled')),
  meta jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_booking_id text,
  type text NOT NULL CHECK (type IN ('flight', 'train', 'bus', 'hotel', 'car', 'activity')),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  price decimal(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  confirmation_code text,
  booking_date timestamptz NOT NULL,
  travel_date timestamptz,
  raw_payload jsonb DEFAULT '{}',
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Route legs
CREATE TABLE IF NOT EXISTS route_legs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location_id uuid REFERENCES locations(id),
  to_location_id uuid REFERENCES locations(id),
  mode text NOT NULL CHECK (mode IN ('walking', 'driving', 'transit', 'cycling', 'flight')),
  distance_m integer NOT NULL,
  duration_s integer NOT NULL,
  geometry jsonb,
  instructions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('delay', 'cancellation', 'weather', 'traffic', 'recommendation', 'gate_change', 'price_drop', 'booking_confirmed')),
  title text NOT NULL,
  content text NOT NULL,
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_read boolean DEFAULT false,
  action_required boolean DEFAULT false,
  meta jsonb DEFAULT '{}',
  sent_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Expense shares
CREATE TABLE IF NOT EXISTS expense_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  total_amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  paid_by uuid REFERENCES users(id),
  paid_by_name text NOT NULL,
  expense_date date NOT NULL,
  category text NOT NULL CHECK (category IN ('flight', 'hotel', 'food', 'transport', 'activity', 'shopping', 'other')),
  receipt_url text,
  is_settled boolean DEFAULT false,
  splits jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_legs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_loyalty_programs
CREATE POLICY "Users can manage own loyalty programs" ON user_loyalty_programs
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for user_payment_methods
CREATE POLICY "Users can manage own payment methods" ON user_payment_methods
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for locations (public read)
CREATE POLICY "Locations are publicly readable" ON locations
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create locations" ON locations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- RLS Policies for trips
CREATE POLICY "Users can manage own trips" ON trips
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read shared trips" ON trips
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR 
    (is_shared = true AND id IN (
      SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
    ))
  );

-- RLS Policies for trip_members
CREATE POLICY "Trip owners can manage members" ON trip_members
  FOR ALL TO authenticated
  USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()) OR
    user_id = auth.uid()
  );

-- RLS Policies for itinerary_days
CREATE POLICY "Users can manage itinerary days for their trips" ON itinerary_days
  FOR ALL TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid() OR 
      (is_shared = true AND id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid()))
    )
  );

-- RLS Policies for itinerary_items
CREATE POLICY "Users can manage itinerary items for their trips" ON itinerary_items
  FOR ALL TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid() OR 
      (is_shared = true AND id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid()))
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can manage own bookings" ON bookings
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read shared trip bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    trip_id IN (
      SELECT id FROM trips WHERE is_shared = true AND id IN (
        SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for route_legs (public read)
CREATE POLICY "Route legs are publicly readable" ON route_legs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create route legs" ON route_legs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- RLS Policies for notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for expense_shares
CREATE POLICY "Users can manage expenses for their trips" ON expense_shares
  FOR ALL TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid() OR 
      (is_shared = true AND id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid()))
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day_id ON itinerary_items(day_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_trip_id ON itinerary_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_expense_shares_trip_id ON expense_shares(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user_id ON trip_members(user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_items_updated_at BEFORE UPDATE ON itinerary_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();