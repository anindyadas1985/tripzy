import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  onViewDetails?: () => void;
  onDownloadReceipt?: () => void;
  onModifyBooking?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onDownloadReceipt,
  onModifyBooking
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'car': return '🚗';
      case 'activity': return '🎭';
      default: return '📋';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-xl">{getTypeIcon(booking.type)}</span>
            <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Provider:</span>
              <span>{booking.provider}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Confirmation:</span>
                <span className="text-gray-900 font-mono ml-2">{booking.confirmationCode}</span>
              </div>
              {booking.details && Object.entries(booking.details).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-gray-900 ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(booking.status)}
              <span className="text-sm text-gray-600">
                {booking.status === 'confirmed' ? 'Booking confirmed' :
                 booking.status === 'pending' ? 'Confirmation pending' :
                 'Booking cancelled'}
              </span>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                ${booking.cost.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
        {onViewDetails && (
          <button 
            onClick={onViewDetails}
            className="text-sky-600 text-sm font-medium hover:text-sky-700"
          >
            View Details
          </button>
        )}
        <span className="text-gray-300">•</span>
        {onDownloadReceipt && (
          <button 
            onClick={onDownloadReceipt}
            className="text-sky-600 text-sm font-medium hover:text-sky-700"
          >
            Download Receipt
          </button>
        )}
        {booking.status === 'confirmed' && onModifyBooking && (
          <>
            <span className="text-gray-300">•</span>
            <button 
              onClick={onModifyBooking}
              className="text-sky-600 text-sm font-medium hover:text-sky-700"
            >
              Modify Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
};