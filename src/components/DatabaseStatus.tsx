import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { databaseSetup } from '../lib/database-setup';

interface DatabaseStatusProps {
  onSetupComplete?: () => void;
}

export const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ onSetupComplete }) => {
  const [status, setStatus] = useState<'checking' | 'setting-up' | 'complete' | 'error'>('checking');
  const [message, setMessage] = useState('Checking database status...');
  const [tablesCreated, setTablesCreated] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setStatus('checking');
      setMessage('Checking database connection...');

      // Check if already initialized
      if (databaseSetup.isSetupCompleted()) {
        setStatus('complete');
        setMessage('Database is ready');
        onSetupComplete?.();
        return;
      }

      setStatus('setting-up');
      setMessage('Setting up database tables...');

      const result = await databaseSetup.initializeDatabase();

      if (result.success) {
        setStatus('complete');
        setMessage('Database setup completed successfully');
        setTablesCreated(result.tablesCreated);
        onSetupComplete?.();
      } else {
        setStatus('error');
        setMessage(result.message);
        setErrors(result.errors);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Database setup failed');
      setErrors([error instanceof Error ? error.message : 'Unknown error']);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
      case 'setting-up':
        return <Loader className="w-5 h-5 animate-spin text-blue-600" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
      case 'setting-up':
        return 'border-blue-200 bg-blue-50';
      case 'complete':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  if (status === 'complete' && !showDetails) {
    return null; // Hide when complete unless details are requested
  }

  return (
    <div className={`border rounded-lg p-4 mb-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-gray-600" />
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="font-medium text-gray-900">Database Setup</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {status === 'error' && (
            <button
              onClick={initializeDatabase}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
          
          {(tablesCreated.length > 0 || errors.length > 0) && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {tablesCreated.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Tables Created:</h4>
              <div className="flex flex-wrap gap-2">
                {tablesCreated.map((table) => (
                  <span
                    key={table}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {table}
                  </span>
                ))}
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};