import React, { useState } from 'react';
import { Building2, Search, Star, MapPin, Phone, Mail, CheckCircle, Clock, X } from 'lucide-react';

interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  isVerified: boolean;
  rating: number;
  totalBookings: number;
  revenue: number;
  status: 'active' | 'pending' | 'suspended';
  createdAt: Date;
}

export const VendorManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'airline' | 'transport' | 'activity'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

  // Mock vendor data
  const mockVendors: Vendor[] = [
    {
      id: '1',
      businessName: 'Royal Palace Hotel',
      ownerName: 'Rajesh Kumar',
      email: 'info@royalpalace.com',
      phone: '+91 22 1234 5678',
      businessType: 'hotel',
      address: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      isVerified: true,
      rating: 4.5,
      totalBookings: 1250,
      revenue: 2500000,
      status: 'active',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      businessName: 'Skyline Airways',
      ownerName: 'Priya Sharma',
      email: 'ops@skylineair.com',
      phone: '+91 11 9876 5432',
      businessType: 'airline',
      address: 'Terminal 3, IGI Airport',
      city: 'New Delhi',
      state: 'Delhi',
      isVerified: true,
      rating: 4.2,
      totalBookings: 5670,
      revenue: 15000000,
      status: 'active',
      createdAt: new Date('2023-08-20')
    },
    {
      id: '3',
      businessName: 'Adventure Tours Kerala',
      ownerName: 'Suresh Nair',
      email: 'contact@adventurekerala.com',
      phone: '+91 484 123 4567',
      businessType: 'activity',
      address: 'Marine Drive',
      city: 'Kochi',
      state: 'Kerala',
      isVerified: false,
      rating: 0,
      totalBookings: 0,
      revenue: 0,
      status: 'pending',
      createdAt: new Date('2025-01-10')
    }
  ];

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || vendor.businessType === filterType;
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return '🏨';
      case 'airline': return '✈️';
      case 'transport': return '🚗';
      case 'activity': return '🎭';
      default: return '🏢';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vendor Management</h1>
        <p className="text-gray-400">Manage hotels, airlines, and service providers</p>
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
                placeholder="Search vendors..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="hotel">Hotels</option>
              <option value="airline">Airlines</option>
              <option value="transport">Transport</option>
              <option value="activity">Activities</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {filteredVendors.length} vendors found
            </span>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:bg-slate-800/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-2xl">
                  {getBusinessTypeIcon(vendor.businessType)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{vendor.businessName}</h3>
                  <p className="text-sm text-gray-400">by {vendor.ownerName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
                {vendor.isVerified && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{vendor.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{vendor.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{vendor.address}, {vendor.city}, {vendor.state}</span>
              </div>
            </div>

            {vendor.status === 'active' && (
              <div className="flex items-center justify-between mb-4 p-3 bg-slate-700/50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {renderStars(vendor.rating)}
                  </div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{vendor.totalBookings}</div>
                  <div className="text-xs text-gray-400">Bookings</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-white">₹{(vendor.revenue / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Joined {formatDate(vendor.createdAt)}
              </div>
              
              <div className="flex items-center space-x-2">
                {vendor.status === 'pending' && (
                  <>
                    <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">
                      Reject
                    </button>
                  </>
                )}
                
                {vendor.status === 'active' && (
                  <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors">
                    Suspend
                  </button>
                )}
                
                {vendor.status === 'suspended' && (
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                    Reactivate
                  </button>
                )}
                
                <button className="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg hover:bg-slate-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No vendors found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};