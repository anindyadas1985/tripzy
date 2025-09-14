import React, { useState } from 'react';
import { MapPin, Search, Calendar, Users, DollarSign, Eye, MoreVertical } from 'lucide-react';

interface Trip {
  id: string;
  title: string;
  userName: string;
  userEmail: string;
  origin: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
  budget: number;
  spent: number;
  status: 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  bookings: number;
  createdAt: Date;
}

export const TripManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');

  // Mock trip data
  const mockTrips: Trip[] = [
    {
      id: '1',
      title: 'European Adventure',
      userName: 'Priya Sharma',
      userEmail: 'priya.sharma@email.com',
      origin: 'Delhi, India',
      destination: 'Paris, France',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-22'),
      travelers: 2,
      budget: 250000,
      spent: 185000,
      status: 'upcoming',
      bookings: 3,
      createdAt: new Date('2025-01-10')
    },
    {
      id: '2',
      title: 'Tokyo Business Trip',
      userName: 'Rajesh Kumar',
      userEmail: 'rajesh.kumar@email.com',
      origin: 'Mumbai, India',
      destination: 'Tokyo, Japan',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-05'),
      travelers: 1,
      budget: 180000,
      spent: 180000,
      status: 'completed',
      bookings: 4,
      createdAt: new Date('2024-12-15')
    },
    {
      id: '3',
      title: 'Kerala Backwaters',
      userName: 'Anita Singh',
      userEmail: 'anita.singh@email.com',
      origin: 'Bangalore, India',
      destination: 'Alleppey, Kerala',
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-01-25'),
      travelers: 4,
      budget: 120000,
      spent: 45000,
      status: 'active',
      bookings: 2,
      createdAt: new Date('2025-01-05')
    },
    {
      id: '4',
      title: 'Goa Beach Holiday',
      userName: 'Vikram Patel',
      userEmail: 'vikram.patel@email.com',
      origin: 'Pune, India',
      destination: 'Goa, India',
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-15'),
      travelers: 3,
      budget: 80000,
      spent: 0,
      status: 'planning',
      bookings: 0,
      createdAt: new Date('2025-01-12')
    }
  ];

  const filteredTrips = mockTrips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'upcoming': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getBudgetUsage = (spent: number, budget: number) => {
    return budget > 0 ? Math.round((spent / budget) * 100) : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Trip Management</h1>
        <p className="text-gray-400">Monitor and manage all user trips</p>
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
                placeholder="Search trips..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {filteredTrips.length} trips found
            </span>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:bg-slate-800/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{trip.title}</h3>
                <p className="text-sm text-gray-400">by {trip.userName}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(trip.status)}`}>
                  {trip.status}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{trip.origin} → {trip.destination}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({getDuration(trip.startDate, trip.endDate)})</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Budget Usage</span>
                <span className="text-sm font-medium text-white">
                  ₹{trip.spent.toLocaleString()} / ₹{trip.budget.toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getBudgetUsage(trip.spent, trip.budget) > 90 ? 'bg-red-500' : 
                    getBudgetUsage(trip.spent, trip.budget) > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(getBudgetUsage(trip.spent, trip.budget), 100)}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                {getBudgetUsage(trip.spent, trip.budget)}% used
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <div>{trip.bookings} bookings</div>
                <div>Created {formatDate(trip.createdAt)}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1 bg-slate-600 text-white text-xs rounded-lg hover:bg-slate-700 transition-colors">
                  <Eye className="w-3 h-3" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No trips found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};