import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Mail, Globe, Key } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'integrations'>('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Journai Travel Platform',
      siteDescription: 'AI-powered travel planning and booking platform',
      supportEmail: 'support@journai.com',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: true,
      systemAlerts: true,
      userRegistrations: true,
      bookingConfirmations: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      ipWhitelist: '',
      auditLogging: true,
      dataRetention: 365
    },
    integrations: {
      googleMapsApiKey: '••••••••••••••••••••••••••••••••••••••••',
      stripeApiKey: '••••••••••••••••••••••••••••••••••••••••',
      twilioApiKey: '••••••••••••••••••••••••••••••••••••••••',
      sendgridApiKey: '••••••••••••••••••••••••••••••••••••••••',
      supabaseUrl: 'https://your-project.supabase.co',
      supabaseKey: '••••••••••••••••••••••••••••••••••••••••'
    }
  });

  const tabs = [
    { id: 'general' as const, label: 'General', icon: SettingsIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'integrations' as const, label: 'Integrations', icon: Key }
  ];

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-gray-400">Configure platform settings and integrations</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-400 bg-slate-700/50'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
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
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {key === 'emailNotifications' && 'Send email notifications to administrators'}
                        {key === 'smsNotifications' && 'Send SMS notifications for critical alerts'}
                        {key === 'pushNotifications' && 'Send push notifications to mobile apps'}
                        {key === 'marketingEmails' && 'Send marketing and promotional emails'}
                        {key === 'systemAlerts' && 'Send system health and error alerts'}
                        {key === 'userRegistrations' && 'Notify when new users register'}
                        {key === 'bookingConfirmations' && 'Send booking confirmation notifications'}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password Policy</label>
                  <select
                    value={settings.security.passwordPolicy}
                    onChange={(e) => updateSetting('security', 'passwordPolicy', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="weak">Weak (6+ characters)</option>
                    <option value="medium">Medium (8+ characters, mixed case)</option>
                    <option value="strong">Strong (12+ characters, mixed case, numbers, symbols)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data Retention (days)</label>
                  <input
                    type="number"
                    value={settings.security.dataRetention}
                    onChange={(e) => updateSetting('security', 'dataRetention', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">IP Whitelist (comma-separated)</label>
                <textarea
                  value={settings.security.ipWhitelist}
                  onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-400">Require 2FA for admin accounts</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Audit Logging</div>
                    <div className="text-sm text-gray-400">Log all admin actions and system events</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.auditLogging}
                      onChange={(e) => updateSetting('security', 'auditLogging', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Integrations</h3>
              
              <div className="space-y-6">
                {Object.entries(settings.integrations).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="relative">
                      <input
                        type={key.includes('Key') ? 'password' : 'text'}
                        value={value as string}
                        onChange={(e) => updateSetting('integrations', key, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                      {key.includes('Key') && (
                        <Key className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-200 mb-1">Security Notice</h4>
                    <p className="text-sm text-blue-200/80">
                      API keys are encrypted and stored securely. Only the last few characters are displayed for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-slate-700">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              <Save className="w-5 h-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};