import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

// Custom hook for real-time subscriptions
export const useSupabaseSubscription = <T extends keyof Tables>(
  table: T,
  filter?: { column: string; value: any }
) => {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (isSubscribed) return;
    
    let query = supabase.from(table).select('*');
    
    if (filter) {
      query = query.eq(filter.column, filter.value);
    }

    // Initial fetch
    query.then(({ data: initialData, error: initialError }) => {
      if (initialError) {
        setError(initialError.message);
      } else {
        setData(initialData || []);
      }
      setLoading(false);
    });

    // Set up real-time subscription
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table as string,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [...prev, payload.new as Tables[T]['Row']]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              (item as any).id === (payload.new as any).id ? payload.new as Tables[T]['Row'] : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => (item as any).id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    setIsSubscribed(true);

    return () => {
      setIsSubscribed(false);
      subscription.unsubscribe();
    };
  }, [table, filter?.column, filter?.value, isSubscribed]);

  return { data, loading, error };
};

// Hook for trips with real-time updates
export const useTrips = () => {
  return useSupabaseSubscription('trips');
};

// Hook for notifications with real-time updates
export const useNotifications = (userId?: string) => {
  return useSupabaseSubscription('notifications', userId ? { column: 'user_id', value: userId } : undefined);
};

// Hook for trip expenses
export const useTripExpenses = (tripId?: string) => {
  return useSupabaseSubscription('expense_shares', tripId ? { column: 'trip_id', value: tripId } : undefined);
};

// Hook for bookings
export const useBookings = (userId?: string) => {
  return useSupabaseSubscription('bookings', userId ? { column: 'user_id', value: userId } : undefined);
};