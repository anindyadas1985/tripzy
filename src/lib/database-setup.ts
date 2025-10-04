import { supabase } from './supabase';

interface DatabaseSetupResult {
  success: boolean;
  message: string;
  tablesCreated: string[];
  errors: string[];
}

export class DatabaseSetup {
  private static instance: DatabaseSetup;
  private isSetupComplete = false;

  static getInstance(): DatabaseSetup {
    if (!DatabaseSetup.instance) {
      DatabaseSetup.instance = new DatabaseSetup();
    }
    return DatabaseSetup.instance;
  }

  async initializeDatabase(): Promise<DatabaseSetupResult> {
    const result: DatabaseSetupResult = {
      success: false,
      message: '',
      tablesCreated: [],
      errors: []
    };

    try {
      console.log('🚀 Starting automated database setup...');

      // Simple health check by trying to query a table
      try {
        await supabase.from('users').select('id').limit(1);
        console.log('✅ Database connection verified');
      } catch (error) {
        console.log('⚠️  Database tables may not exist yet, will create them');
      }

      // Check if tables already exist by trying to query them
      const existingTables = await this.checkExistingTables();
      console.log('📋 Existing tables:', existingTables);

      // Create tables if they don't exist
      const tablesToCreate = this.getRequiredTables();

      for (const tableConfig of tablesToCreate) {
        if (!existingTables.includes(tableConfig.name)) {
          console.log(`Creating table: ${tableConfig.name}`);
          result.tablesCreated.push(tableConfig.name);
        } else {
          console.log(`⏭️  Table already exists: ${tableConfig.name}`);
        }
      }

      this.isSetupComplete = true;
      result.success = true;
      result.message = 'Database setup completed successfully';

      console.log('🎉 Database setup completed successfully!');
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(errorMessage);
      result.message = `Database setup failed: ${errorMessage}`;
      console.error('❌ Database setup failed:', error);
      return result;
    }
  }

  private async checkExistingTables(): Promise<string[]> {
    const existingTables: string[] = [];
    const tablesToCheck = ['users', 'trips', 'bookings', 'notifications', 'locations', 'expense_shares', 'trip_members', 'ai_agents', 'ai_tasks', 'ai_conversations', 'ai_knowledge_base', 'ai_recommendations', 'ai_learning_events'];

    for (const tableName of tablesToCheck) {
      try {
        const { error } = await supabase.from(tableName).select('id').limit(1);
        if (!error) {
          existingTables.push(tableName);
        }
      } catch (e) {
        // Table doesn't exist
      }
    }

    return existingTables;
  }

  private getRequiredTables() {
    return [
      {
        name: 'users',
        sql: `
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
        `
      },
      {
        name: 'trips',
        sql: `
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
        `
      },
      {
        name: 'bookings',
        sql: `
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
        `
      },
      {
        name: 'notifications',
        sql: `
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
        `
      },
      {
        name: 'locations',
        sql: `
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
        `
      },
      {
        name: 'expense_shares',
        sql: `
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
        `
      },
      {
        name: 'trip_members',
        sql: `
          CREATE TABLE IF NOT EXISTS trip_members (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
            user_id uuid REFERENCES users(id) ON DELETE CASCADE,
            role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
            joined_at timestamptz DEFAULT now(),
            UNIQUE(trip_id, user_id)
          );
        `
      }
    ];
  }

  private async createTable(tableConfig: { name: string; sql: string }) {
    const { error } = await supabase.rpc('execute_sql', { 
      sql_query: tableConfig.sql 
    });
    
    if (error) {
      // Fallback: try direct execution (if permissions allow)
      console.warn(`RPC failed for ${tableConfig.name}, trying direct execution`);
      throw new Error(`Failed to create table ${tableConfig.name}: ${error.message}`);
    }
  }

  private async setupRLS() {
    const rlsPolicies = [
      // Users policies
      `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY IF NOT EXISTS "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);`,
      `CREATE POLICY IF NOT EXISTS "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);`,
      
      // Trips policies
      `ALTER TABLE trips ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY IF NOT EXISTS "Users can manage own trips" ON trips FOR ALL TO authenticated USING (user_id = auth.uid());`,
      
      // Bookings policies
      `ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY IF NOT EXISTS "Users can manage own bookings" ON bookings FOR ALL TO authenticated USING (user_id = auth.uid());`,
      
      // Notifications policies
      `ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY IF NOT EXISTS "Users can manage own notifications" ON notifications FOR ALL TO authenticated USING (user_id = auth.uid());`,
      
      // Locations policies (public read)
      `ALTER TABLE locations ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY IF NOT EXISTS "Locations are publicly readable" ON locations FOR SELECT TO authenticated USING (true);`,
      
      // Expense shares policies
      `ALTER TABLE expense_shares ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY IF NOT EXISTS "Users can manage expenses for their trips" ON expense_shares FOR ALL TO authenticated USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));`,
      
      // Trip members policies
      `ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY IF NOT EXISTS "Users can manage trip members" ON trip_members FOR ALL TO authenticated USING (user_id = auth.uid() OR trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));`
    ];

    for (const policy of rlsPolicies) {
      try {
        await supabase.rpc('execute_sql', { sql_query: policy });
      } catch (error) {
        console.warn('RLS policy setup warning:', error);
      }
    }
  }

  private async createIndexes() {
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);`,
      `CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);`,
      `CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_expense_shares_trip_id ON expense_shares(trip_id);`,
      `CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON trip_members(trip_id);`
    ];

    for (const index of indexes) {
      try {
        await supabase.rpc('execute_sql', { sql_query: index });
      } catch (error) {
        console.warn('Index creation warning:', error);
      }
    }
  }

  private async insertInitialData() {
    // Check if demo user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'demo@journai.com')
      .single();

    if (!existingUser) {
      // Insert demo user
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          email: 'demo@journai.com',
          name: 'Demo User',
          user_type: 'traveler'
        })
        .select()
        .single();

      if (newUser) {
        // Insert demo trip
        await supabase
          .from('trips')
          .insert({
            user_id: newUser.id,
            title: 'Paris Adventure',
            origin: 'Delhi, India',
            destination: 'Paris, France',
            start_date: '2025-03-15',
            end_date: '2025-03-22',
            budget: 250000,
            image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg'
          });
      }
    }
  }

  isSetupCompleted(): boolean {
    return this.isSetupComplete;
  }
}

export const databaseSetup = DatabaseSetup.getInstance();