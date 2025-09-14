-- Initial database setup for local development
-- This file is automatically executed when PostgreSQL starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  user_type text NOT NULL DEFAULT 'traveler',
  preferences jsonb DEFAULT '{}',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'planning',
  style text NOT NULL DEFAULT 'leisure',
  pace text NOT NULL DEFAULT 'moderate',
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

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  provider text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  price decimal(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  confirmation_code text,
  booking_date timestamptz NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  is_read boolean DEFAULT false,
  sent_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Insert sample data for development
INSERT INTO users (id, email, name, user_type) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@journai.com', 'Demo User', 'traveler')
ON CONFLICT (email) DO NOTHING;

INSERT INTO trips (user_id, title, origin, destination, start_date, end_date, budget, image) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Paris Adventure', 'Delhi, India', 'Paris, France', '2025-03-15', '2025-03-22', 250000, 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg')
ON CONFLICT DO NOTHING;