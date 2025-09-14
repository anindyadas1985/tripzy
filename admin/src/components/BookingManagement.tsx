import React, { useState } from 'react';
import { Calendar, Search, Plane, Building, Car, Activity, DollarSign, User, CheckCircle, Clock, X } from 'lucide-react';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'activity';
  title: string;
  userName: string;
  userEmail: string;
  provider: string;
  confirmationCode: string;
  bookingDate: Date;
  travelDate: Date;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  commission: number;
}

export const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'flight' | 'hotel' | 'car' | 'activity'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  // Mock booking data
  const mockBookings: Booking[] = [
    {
      id: '1',
      type: 'flight',
      title: 'DEL to CDG',
      userName: 'Priya Sharma',
      userEmail: 'priya.sharma@email.com',
      provider: 'Air France',
      confirmationCode: 'AF1234567',
      bookingDate: new Date('2025-01-10'),
      travelDate: new Date('2025-03-15'),
      amount: 45000,
      status: 'confirmed',
      commission: 2250
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Hotel Le Marais - 7 nights',
      userName: 'Priya Sharma',
      userEmail: 'priya.sharma@email.com',
      provider: 'Booking.com',
      confirmationCode: 'BK9876543',
      bookingDate: new Date('2025-01-10'),
      travelDate: new Date('2025-03-15'),
      amount: 75000,
      status: 'confirmed',
      commission: 7500
    },
    {
      id: '3',
      type: 'activity',
      title: 'Eiffel Tower Skip-the-Line',
      userName: 'Rajesh Kumar',
      userEmail: 'rajesh.kumar@email.com',
      provider: 'GetYourGuide',
      confirmationCode: 'GYG123456',
      bookingDate: new Date('2025-01-12'),
      travelDate: new Date('2025-02-20'),
      amount: 3500,
      status: 'pending',
      commission: 350
    },
    {
      id: '4',
      type: 'car',
      title: 'Toyota Camry - 5 days',
      userName: 'Anita Singh',
      userEmail: 'anita.singh@email.com',
      provider: 'Hertz',
      confirmationCode: 'HZ789012',
      bookingDate: new Date('2025-01-08'),
      travelDate: new Date('2025-01-20'),
      amount: 15000,
      status: 'cancelled',
      commission: 0
    }
  ];

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || booking.type === filterType;
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Building;
      case 'car': return Car;
      case 'activity': return Activity;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flight': return 'from-sky-500 to-blue-600';
      case 'hotel': return 'from-purple-500 to-indigo-600';
      case 'car': return 'from-green-500 to-emerald-600';
      case 'activity': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'cancelled': return X;
      default: return Clock;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalRevenue = filteredBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalCommission = filteredBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.commission, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
        <p className="text-gray-400">Monitor all bookings and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="text-2xl font-bold text-white">{filteredBookings.length}</div>
          <div className="text-sm text-gray-400">Total Bookings</div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Revenue</div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="text-2xl font-bold text-amber-400">₹{totalCommission.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Commission Earned</div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="text-2xl font-bold text-blue-400">
            {filteredBookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-400">Confirmed</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="flight">Flights</option>
              <option value="hotel">Hotels</option>
              <option value="car">Car Rentals</option>
              <option value="activity">Activities</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {filteredBookings.length} bookings found
            </span>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredBookings.map((booking) => {
                const TypeIcon = getTypeIcon(booking.type);
                const StatusIcon = getStatusIcon(booking.status);
                
                return (
                  <tr key={booking.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getTypeColor(booking.type)} rounded-lg flex items-center justify-center`}>
                          <TypeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{booking.title}</div>
                          <div className="text-xs text-gray-400">#{booking.confirmationCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-white">{booking.userName}</div>
                          <div className="text-xs text-gray-400">{booking.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{booking.provider}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">
                        <div>Booked: {formatDate(booking.bookingDate)}</div>
                        <div className="text-xs text-gray-400">Travel: {formatDate(booking.travelDate)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white font-medium">₹{booking.amount.toLocaleString()}</div>
                      {booking.commission > 0 && (
                        <div className="text-xs text-green-400">+₹{booking.commission.toLocaleString()} commission</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-4 h-4" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No bookings found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};