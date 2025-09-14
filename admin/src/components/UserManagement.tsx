import React, { useState } from 'react';
import { Users, Search, Filter, MoreVertical, Mail, Phone, Calendar, Shield, Ban, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: 'traveler' | 'vendor';
  isVerified: boolean;
  status: 'active' | 'suspended' | 'pending';
  createdAt: Date;
  lastLogin?: Date;
  totalTrips: number;
  totalSpent: number;
}

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'traveler' | 'vendor'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

  // Mock user data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      userType: 'traveler',
      isVerified: true,
      status: 'active',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2025-01-13'),
      totalTrips: 5,
      totalSpent: 125000
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 87654 32109',
      userType: 'traveler',
      isVerified: true,
      status: 'active',
      createdAt: new Date('2024-02-20'),
      lastLogin: new Date('2025-01-12'),
      totalTrips: 3,
      totalSpent: 85000
    },
    {
      id: '3',
      name: 'Royal Palace Hotel',
      email: 'info@royalpalace.com',
      phone: '+91 22 1234 5678',
      userType: 'vendor',
      isVerified: false,
      status: 'pending',
      createdAt: new Date('2025-01-10'),
      totalTrips: 0,
      totalSpent: 0
    },
    {
      id: '4',
      name: 'Anita Singh',
      email: 'anita.singh@email.com',
      phone: '+91 76543 21098',
      userType: 'traveler',
      isVerified: true,
      status: 'suspended',
      createdAt: new Date('2024-03-10'),
      lastLogin: new Date('2025-01-05'),
      totalTrips: 2,
      totalSpent: 45000
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.userType === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
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

  const getUserTypeIcon = (userType: string) => {
    return userType === 'vendor' ? '🏢' : '👤';
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
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage travelers and vendors on the platform</p>
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
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="traveler">Travelers</option>
              <option value="vendor">Vendors</option>
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
              {filteredUsers.length} users found
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getUserTypeIcon(user.userType)}</span>
                      <span className="text-sm text-gray-300 capitalize">{user.userType}</span>
                      {user.isVerified && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      <div>{user.totalTrips} trips</div>
                      <div className="text-xs text-gray-400">₹{user.totalSpent.toLocaleString()} spent</div>
                      {user.lastLogin && (
                        <div className="text-xs text-gray-500">
                          Last: {formatDate(user.lastLogin)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {user.status === 'active' && (
                        <button className="p-1 text-red-400 hover:text-red-300 transition-colors" title="Suspend User">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      {user.status === 'suspended' && (
                        <button className="p-1 text-green-400 hover:text-green-300 transition-colors" title="Activate User">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {user.status === 'pending' && !user.isVerified && (
                        <button className="p-1 text-blue-400 hover:text-blue-300 transition-colors" title="Verify User">
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};