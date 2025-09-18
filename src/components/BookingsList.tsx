import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { BookingCard } from './booking/BookingCard';
import { EmptyState } from './common/EmptyState';
import { useTripContext } from '../contexts/TripContext';

export const BookingsList: React.FC = () => {
  const { bookings, setBookings } = useTripContext();

  // Load bookings from localStorage on component mount
  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem('journai_bookings');
      if (storedBookings) {
        const parsedBookings = JSON.parse(storedBookings);
        setBookings(parsedBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  }, [setBookings]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
        <span className="text-sm text-gray-600">
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
        </span>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings yet"
          description="Start planning your trip to create your first booking"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={() => console.log('View details:', booking.id)}
              onDownloadReceipt={() => console.log('Download receipt:', booking.id)}
              onModifyBooking={() => console.log('Modify booking:', booking.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};