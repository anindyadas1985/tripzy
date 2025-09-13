import React, { useState } from 'react';
import { Plus, Receipt, Users, DollarSign, Check, Clock, Camera, ArrowUpDown } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';
import { ExpenseShare, ExpenseSplit, ExpenseSummary } from '../types';

export const ExpenseSharing: React.FC = () => {
  const { expenses, tripMembers, addExpense, settleExpense, activeTrip } = useTripContext();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'settlements'>('expenses');

  // Mock trip members for demo
  const mockMembers = [
    { id: '1', name: 'You', email: 'you@email.com', isOwner: true, joinedAt: new Date() },
    { id: '2', name: 'Priya Sharma', email: 'priya@email.com', isOwner: false, joinedAt: new Date() },
    { id: '3', name: 'Rahul Kumar', email: 'rahul@email.com', isOwner: false, joinedAt: new Date() },
    { id: '4', name: 'Anita Singh', email: 'anita@email.com', isOwner: false, joinedAt: new Date() }
  ];

  // Mock expenses for demo
  const mockExpenses: ExpenseShare[] = [
    {
      id: '1',
      tripId: activeTrip?.id || '1',
      title: 'Hotel Booking - Le Marais',
      description: '3 nights accommodation',
      totalAmount: 15000,
      currency: 'INR',
      paidBy: '1',
      paidByName: 'You',
      date: new Date('2025-01-15'),
      category: 'hotel',
      splits: [
        { userId: '1', userName: 'You', amount: 3750, isPaid: true },
        { userId: '2', userName: 'Priya Sharma', amount: 3750, isPaid: false },
        { userId: '3', userName: 'Rahul Kumar', amount: 3750, isPaid: true },
        { userId: '4', userName: 'Anita Singh', amount: 3750, isPaid: false }
      ],
      isSettled: false,
      createdAt: new Date('2025-01-15')
    },
    {
      id: '2',
      tripId: activeTrip?.id || '1',
      title: 'Group Dinner at Le Comptoir',
      description: 'French cuisine for 4 people',
      totalAmount: 8000,
      currency: 'INR',
      paidBy: '2',
      paidByName: 'Priya Sharma',
      date: new Date('2025-01-16'),
      category: 'food',
      splits: [
        { userId: '1', userName: 'You', amount: 2000, isPaid: false },
        { userId: '2', userName: 'Priya Sharma', amount: 2000, isPaid: true },
        { userId: '3', userName: 'Rahul Kumar', amount: 2000, isPaid: true },
        { userId: '4', userName: 'Anita Singh', amount: 2000, isPaid: false }
      ],
      isSettled: false,
      createdAt: new Date('2025-01-16')
    }
  ];

  const calculateBalances = (): ExpenseSummary[] => {
    const balances: { [userId: string]: ExpenseSummary } = {};

    // Initialize balances for all members
    mockMembers.forEach(member => {
      balances[member.id] = {
        userId: member.id,
        userName: member.name,
        totalPaid: 0,
        totalOwed: 0,
        balance: 0
      };
    });

    // Calculate from expenses
    mockExpenses.forEach(expense => {
      // Add to total paid for the person who paid
      balances[expense.paidBy].totalPaid += expense.totalAmount;

      // Add to total owed for each person's split
      expense.splits.forEach(split => {
        balances[split.userId].totalOwed += split.amount;
      });
    });

    // Calculate net balance (positive = owed money, negative = owes money)
    Object.values(balances).forEach(balance => {
      balance.balance = balance.totalPaid - balance.totalOwed;
    });

    return Object.values(balances);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hotel': return '🏨';
      case 'flight': return '✈️';
      case 'food': return '🍽️';
      case 'transport': return '🚗';
      case 'activity': return '🎭';
      case 'shopping': return '🛍️';
      default: return '💰';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hotel': return 'bg-purple-100 text-purple-800';
      case 'flight': return 'bg-sky-100 text-sky-800';
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'transport': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-pink-100 text-pink-800';
      case 'shopping': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const balances = calculateBalances();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Expenses</h1>
            <p className="text-gray-600">Split and track shared expenses with your travel companions</p>
          </div>
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-sky-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Trip Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Trip Members</h3>
          </div>
          <div className="flex items-center space-x-3">
            {mockMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {member.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-900">{member.name}</span>
                {member.isOwner && (
                  <span className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full">Owner</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'expenses' as const, label: 'Expenses', icon: Receipt },
              { id: 'balances' as const, label: 'Balances', icon: ArrowUpDown },
              { id: 'settlements' as const, label: 'Settlements', icon: Check }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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

        <div className="p-6">
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              {mockExpenses.map((expense) => (
                <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                        {expense.description && (
                          <p className="text-sm text-gray-600">{expense.description}</p>
                        )}
                        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                          <span>Paid by {expense.paidByName}</span>
                          <span>•</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{expense.totalAmount.toLocaleString()}</div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {expense.splits.map((split) => (
                      <div key={split.userId} className={`p-3 rounded-lg border ${
                        split.isPaid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{split.userName}</span>
                          {split.isPaid ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div className="text-lg font-bold text-gray-900">₹{split.amount.toLocaleString()}</div>
                        <div className={`text-xs ${split.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                          {split.isPaid ? 'Paid' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!expense.isSettled && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {expense.splits.filter(s => s.isPaid).length} of {expense.splits.length} paid
                        </span>
                        <button className="text-sky-600 text-sm font-medium hover:text-sky-700">
                          Send Reminder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'balances' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {balances.map((balance) => (
                  <div key={balance.userId} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {balance.userName.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900">{balance.userName}</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid:</span>
                        <span className="font-medium">₹{balance.totalPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Owed:</span>
                        <span className="font-medium">₹{balance.totalOwed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-medium">Balance:</span>
                        <span className={`font-bold ${
                          balance.balance > 0 ? 'text-green-600' : 
                          balance.balance < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {balance.balance > 0 ? '+' : ''}₹{balance.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Settlement Suggestions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">Priya Sharma should pay You</span>
                    <span className="font-bold text-blue-900">₹1,750</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">Anita Singh should pay You</span>
                    <span className="font-bold text-blue-900">₹3,750</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settlements' && (
            <div className="text-center py-12">
              <Check className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No settlements yet</h3>
              <p className="text-gray-600">Completed settlements will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Expense</h3>
              <button
                onClick={() => setShowAddExpense(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g., Dinner at restaurant"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none">
                  <option value="food">Food & Dining</option>
                  <option value="hotel">Accommodation</option>
                  <option value="transport">Transportation</option>
                  <option value="activity">Activities</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paid by</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none">
                  {mockMembers.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Split Between</label>
                <div className="space-y-2">
                  {mockMembers.map((member) => (
                    <label key={member.id} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Camera className="w-5 h-5 text-gray-400" />
                <button type="button" className="text-sky-600 text-sm font-medium hover:text-sky-700">
                  Add Receipt Photo
                </button>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};