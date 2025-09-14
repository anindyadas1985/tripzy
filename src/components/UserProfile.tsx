import React, { useState } from 'react';
import { User, CreditCard, Bell, Globe, Shield, Download, Star, Phone, Mail } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

export const UserProfile: React.FC = () => {
  const { userProfile, setUserProfile } = useTripContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'loyalty' | 'settings'>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard },
    { id: 'loyalty' as const, label: 'Loyalty', icon: Star },
    { id: 'settings' as const, label: 'Settings', icon: Bell }
  ];

  const mockProfile = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    preferences: {
      currency: 'USD',
      language: 'English',
      notifications: true,
      newsletter: true
    },
    loyaltyPrograms: [
      {
        id: '1',
        provider: 'Delta SkyMiles',
        membershipNumber: 'DL123456789',
        tier: 'Gold',
        points: 45000
      },
      {
        id: '2',
        provider: 'Marriott Bonvoy',
        membershipNumber: 'MB987654321',
        tier: 'Platinum',
        points: 125000
      }
    ],
    paymentMethods: [
      {
        id: '1',
        type: 'credit' as const,
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027,
        isDefault: true
      },
      {
        id: '2',
        type: 'credit' as const,
        last4: '8888',
        brand: 'Mastercard',
        expiryMonth: 8,
        expiryYear: 2026,
        isDefault: false
      }
    ],
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{mockProfile.name}</h2>
                <p className="text-gray-600">{mockProfile.email}</p>
                <button className="mt-2 text-sky-600 hover:text-sky-700 font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{mockProfile.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{mockProfile.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-gray-900">{mockProfile.emergencyContact.name}</div>
                  <div className="text-sm text-gray-600">{mockProfile.emergencyContact.relationship}</div>
                  <div className="text-sm text-gray-600">{mockProfile.emergencyContact.phone}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                Add Payment Method
              </button>
            </div>

            <div className="space-y-4">
              {mockProfile.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {method.brand} •••• {method.last4}
                      </div>
                      <div className="text-sm text-gray-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                      <span className="sr-only">More options</span>
                      •••
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'loyalty':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Loyalty Programs</h3>
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                Add Program
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProfile.loyaltyPrograms.map((program) => (
                <div key={program.id} className="p-6 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{program.provider}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      program.tier === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                      program.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {program.tier}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Member Number</div>
                    <div className="font-mono text-sm">{program.membershipNumber}</div>
                    
                    <div className="text-sm text-gray-600 mt-3">Points Balance</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {program.points.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Push Notifications</div>
                    <div className="text-sm text-gray-600">Get updates about your trips</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Currency</div>
                    <div className="text-sm text-gray-600">INR - Indian Rupee</div>
                  </div>
                </div>
                <button className="text-sky-600 hover:text-sky-700 font-medium">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Offline Access</div>
                    <div className="text-sm text-gray-600">Download trips for offline use</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Privacy & Security</div>
                    <div className="text-sm text-gray-600">Manage your data and privacy</div>
                  </div>
                </div>
                <button className="text-sky-600 hover:text-sky-700 font-medium">
                  Manage
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600 bg-sky-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};