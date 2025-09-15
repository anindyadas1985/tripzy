import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { databaseSetup } from './database-setup';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not provided (for development)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found. Running in demo mode.');
    // Return a mock client for development
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
        eq: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null })
      }),
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
      })
    };
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};

export const supabase = createSupabaseClient() as any;

// Auto-initialize database on first connection
let initializationPromise: Promise<void> | null = null;

export const ensureDatabaseInitialized = async (): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('🔧 Running in demo mode - skipping database initialization');
    return Promise.resolve();
  }

  initializationPromise = (async () => {
    try {
      console.log('🚀 Initializing database...');
      const result = await databaseSetup.initializeDatabase();
      
      if (result.success) {
        console.log('✅ Database initialization completed');
        if (result.tablesCreated.length > 0) {
          console.log('📋 Tables created:', result.tablesCreated);
        }
      } else {
        console.error('❌ Database initialization failed:', result.message);
        console.error('Errors:', result.errors);
      }
    } catch (error) {
      console.error('💥 Database initialization error:', error);
    }
  })();

  return initializationPromise;
};

// Helper functions for common operations
export const getCurrentUser = async () => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return null; // Return null in demo mode
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signUp = async (email: string, password: string, userData: any) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return { user: { id: '1', email, created_at: new Date().toISOString() } };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return { user: { id: '1', email, created_at: new Date().toISOString() } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return; // No-op in demo mode
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Trip operations
export const createTrip = async (tripData: any) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ...tripData, id: Date.now().toString() }; // Mock response
  }
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('trips')
    .insert({
      ...tripData,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserTrips = async () => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return []; // Mock empty response
  }
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      itinerary_days (
        *,
        itinerary_items (*)
      ),
      bookings (*),
      trip_members (
        *,
        users (name, email)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Booking operations
export const createBooking = async (bookingData: any) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ...bookingData, id: Date.now().toString() }; // Mock response
  }
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...bookingData,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Expense sharing operations
export const createExpense = async (expenseData: any) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ...expenseData, id: Date.now().toString() }; // Mock response
  }
  const { data, error } = await supabase
    .from('expense_shares')
    .insert(expenseData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTripExpenses = async (tripId: string) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return []; // Mock empty response
  }
  const { data, error } = await supabase
    .from('expense_shares')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Notification operations
export const getUserNotifications = async () => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return []; // Mock empty response
  }
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('sent_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return; // No-op in demo mode
  }
  const { error } = await supabase
    .from('notifications')
    .update({ 
      is_read: true, 
      read_at: new Date().toISOString() 
    })
    .eq('id', notificationId);

  if (error) throw error;
};

// Location operations
export const searchLocations = async (query: string) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return []; // Mock empty response
  }
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return data;
};

export const createLocation = async (locationData: any) => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ...locationData, id: Date.now().toString() }; // Mock response
  }
  const { data, error } = await supabase
    .from('locations')
    .insert(locationData)
    .select()
    .single();

  if (error) throw error;
  return data;
};