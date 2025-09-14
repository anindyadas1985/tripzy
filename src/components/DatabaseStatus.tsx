import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { databaseSetup } from '../lib/database-setup';

export const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState({
    isComplete: false,
    tablesExist: false,
    connectionWorking: false,
    isLoading: true,
    error: null as string | null
  });

  const [isInitializing, setIsInitializing] = useState(false);

  const checkStatus = async () => {
    try {
      const setupStatus = await databaseSetup.getSetupStatus();
      setStatus({
        ...setupStatus,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const initializeDatabase = async () => {
    setIsInitializing(true);
    try {
      const result = await databaseSetup.initializeDatabase();
      if (result.success) {
        await checkStatus();
      } else {
        setStatus(prev => ({
          ...prev,
          error: result.error || result.message
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Initialization failed'
      }));
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusColor = () => {
    if (status.isLoading) return 'text-gray-500';
    if (status.error) return 'text-red-600';
    if (status.isComplete && status.tablesExist && status.connectionWorking) return 'text-green-600';
    if (status.connectionWorking) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (status.isLoading) return <Loader className="w-4 h-4 animate-spin" />;
    if (status.error) return <AlertCircle className="w-4 h-4" />;
    if (status.isComplete && status.tablesExist && status.connectionWorking) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusMessage = () => {
    if (status.isLoading) return 'Checking database status...';
    if (status.error) return `Error: ${status.error}`;
    if (status.isComplete && status.tablesExist && status.connectionWorking) return 'Database is ready';
    if (status.connectionWorking && !status.tablesExist) return 'Database connected, tables need setup';
    if (!status.connectionWorking) return 'Database connection failed';
    return 'Database needs initialization';
  };

  // Don't show if everything is working fine
  if (status.isComplete && status.tablesExist && status.connectionWorking && !status.error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Database className="w-6 h-6 text-sky-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`${getStatusColor()}`}>
              {getStatusIcon()}
            </span>
            <h4 className="text-sm font-medium text-gray-900">Database Status</h4>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {getStatusMessage()}
          </p>

          {/* Status indicators */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status.connectionWorking ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-600">Connection</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status.tablesExist ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-gray-600">Tables</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status.isComplete ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-gray-600">Setup</span>
            </div>
          </div>

          <div className="flex space-x-2">
            {!status.isComplete && status.connectionWorking && (
              <button
                onClick={initializeDatabase}
                disabled={isInitializing}
                className="flex items-center space-x-1 px-3 py-1.5 bg-sky-600 text-white text-xs rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50"
              >
                {isInitializing ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <Database className="w-3 h-3" />
                )}
                <span>{isInitializing ? 'Setting up...' : 'Setup Database'}</span>
              </button>
            )}
            
            <button
              onClick={checkStatus}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};