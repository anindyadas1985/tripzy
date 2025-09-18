import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { databaseSetup } from './database-setup';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not provided (for development)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found. Running in demo mode.');
    
    // Create a chainable mock query builder
    const createMockQueryBuilder = () => {
      const mockBuilder = {
        select: () => mockBuilder,
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => mockBuilder,
        delete: () => mockBuilder,
        eq: () => mockBuilder,
        order: () => mockBuilder,
        limit: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null }),
        data: [],
        error: null
      };
      return mockBuilder;
    };

    // Return a mock client for development
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => createMockQueryBuilder(),
      rpc: () => Promise.resolve({ data: [], error: null }),
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
let isInitializing = false;

export const ensureDatabaseInitialized = async (): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise;
  }

  if (isInitializing) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!isInitializing) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return Promise.resolve();
  }

  isInitializing = true;
  initializationPromise = (async () => {
    try {
      const result = await databaseSetup.initializeDatabase();
      
      if (result.success) {
        if (result.tablesCreated.length > 0) {
          // Tables created successfully
        }
      } else {
        console.error('❌ Database initialization failed:', result.message);
        console.error('Errors:', result.errors);
      }
    } catch (error) {
      console.error('💥 Database initialization error:', error);
    } finally {
      isInitializing = false;
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

export const signInWithGoogle = async () => {
  await ensureDatabaseInitialized();
  if (!supabaseUrl || !supabaseAnonKey) {
    // Mock Google login for demo mode
    return { 
      user: { 
        id: '1', 
        email: 'demo@gmail.com', 
        user_metadata: { 
          name: 'Demo User',
          avatar_url: 'https://via.placeholder.com/150',
          provider: 'google'
        },
        created_at: new Date().toISOString() 
      } 
    };
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  if (error) throw error;
  return data;
};

export const handleOAuthCallback = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null; // No-op in demo mode
  }
  
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
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