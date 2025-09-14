import React, { useState } from 'react';
import { Database, Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export const SupabaseSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const steps = [
    {
      title: 'Create Supabase Project',
      description: 'Sign up at supabase.com and create a new project',
      action: (
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Go to Supabase</span>
        </a>
      )
    },
    {
      title: 'Run Database Migration',
      description: 'Copy and run the SQL migration in your Supabase SQL editor',
      action: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Go to your Supabase project → SQL Editor → New Query
          </p>
          <p className="text-sm text-gray-600">
            Copy the contents of <code>supabase/migrations/create_travel_schema.sql</code>
          </p>
        </div>
      )
    },
    {
      title: 'Get Project Credentials',
      description: 'Find your project URL and anon key in Settings → API',
      action: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anon Key
            </label>
            <input
              type="text"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Configure Environment',
      description: 'Add your credentials to the environment variables',
      action: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Create a <code>.env</code> file in your project root:
          </p>
          <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
            <div>VITE_SUPABASE_URL={supabaseUrl || 'your_project_url'}</div>
            <div>VITE_SUPABASE_ANON_KEY={supabaseKey || 'your_anon_key'}</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Setup</h1>
        <p className="text-gray-600">Configure your database to enable all Journai features</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Setup Progress</span>
            <span className="text-sm text-gray-500">{step} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="p-6">
          {steps.map((stepData, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;

            return (
              <div key={stepNumber} className={`flex items-start space-x-4 pb-8 ${
                stepNumber < steps.length ? 'border-b border-gray-100' : ''
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100 text-green-600' :
                  isActive ? 'bg-sky-100 text-sky-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isActive ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {stepData.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{stepData.description}</p>
                  
                  {isActive && (
                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                      {stepData.action}
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sky-200">
                        <button
                          onClick={() => setStep(Math.max(1, step - 1))}
                          disabled={step === 1}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setStep(Math.min(steps.length, step + 1))}
                          className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                        >
                          {step === steps.length ? 'Complete Setup' : 'Next Step'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Database Schema Info */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Database Schema</h4>
              <p className="text-sm text-gray-600">
                The migration creates tables for users, trips, bookings, expenses, notifications, and more. 
                All tables include Row Level Security (RLS) policies for data protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Enabled */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: '🗺️', title: 'Trip Planning', desc: 'AI-powered itinerary generation' },
          { icon: '📱', title: 'Real-time Updates', desc: 'Live notifications and alerts' },
          { icon: '💳', title: 'Booking Management', desc: 'Integrated booking system' },
          { icon: '🧾', title: 'Expense Sharing', desc: 'Splitwise-like functionality' },
          { icon: '🔄', title: 'Offline Sync', desc: 'Work offline, sync when online' },
          { icon: '👥', title: 'Trip Sharing', desc: 'Collaborate with travel companions' }
        ].map((feature, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};