import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Zap, AlertTriangle, CheckCircle, Clock, Cpu } from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: number;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: number;
  lastCheck: Date;
}

export const SystemMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', threshold: 80 },
    { name: 'Memory Usage', value: 62, unit: '%', status: 'healthy', threshold: 85 },
    { name: 'Disk Usage', value: 78, unit: '%', status: 'warning', threshold: 90 },
    { name: 'Network I/O', value: 234, unit: 'MB/s', status: 'healthy', threshold: 1000 }
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Gateway',
      status: 'online',
      uptime: '99.9%',
      responseTime: 145,
      lastCheck: new Date()
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.8%',
      responseTime: 23,
      lastCheck: new Date()
    },
    {
      name: 'Payment Service',
      status: 'online',
      uptime: '99.7%',
      responseTime: 89,
      lastCheck: new Date()
    },
    {
      name: 'Notification Service',
      status: 'degraded',
      uptime: '98.2%',
      responseTime: 456,
      lastCheck: new Date()
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: '99.9%',
      responseTime: 67,
      lastCheck: new Date()
    },
    {
      name: 'Search Engine',
      status: 'online',
      uptime: '99.6%',
      responseTime: 234,
      lastCheck: new Date()
    }
  ]);

  const [alerts] = useState([
    {
      id: '1',
      severity: 'warning',
      message: 'Disk usage approaching 80% threshold',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      service: 'File Storage'
    },
    {
      id: '2',
      severity: 'info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      service: 'Database'
    },
    {
      id: '3',
      severity: 'warning',
      message: 'High response time detected in notification service',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      service: 'Notification Service'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 10)
      })));

      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(10, service.responseTime + (Math.random() - 0.5) * 50),
        lastCheck: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-400';
      case 'warning':
      case 'degraded':
        return 'text-yellow-400';
      case 'critical':
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return CheckCircle;
      case 'warning':
      case 'degraded':
        return AlertTriangle;
      case 'critical':
      case 'offline':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-200';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200';
      case 'info': return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Monitoring</h1>
        <p className="text-gray-400">Real-time system health and performance metrics</p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const StatusIcon = getStatusIcon(metric.status);
          return (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <StatusIcon className={`w-5 h-5 ${getStatusColor(metric.status)}`} />
              </div>
              
              <div className="text-2xl font-bold text-white mb-1">
                {metric.value.toFixed(1)}{metric.unit}
              </div>
              <div className="text-sm text-gray-400 mb-3">{metric.name}</div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric.status === 'critical' ? 'bg-red-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Service Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Service Status</h3>
          </div>
          
          <div className="space-y-4">
            {services.map((service, index) => {
              const StatusIcon = getStatusIcon(service.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                    <div>
                      <div className="text-sm font-medium text-white">{service.name}</div>
                      <div className="text-xs text-gray-400">
                        Uptime: {service.uptime} • Response: {service.responseTime}ms
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(service.lastCheck)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">{alert.severity}</span>
                  <span className="text-xs opacity-75">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-sm opacity-90 mb-1">{alert.message}</p>
                <p className="text-xs opacity-75">Service: {alert.service}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">99.8%</div>
            <div className="text-sm text-gray-400">Overall Uptime</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-10 h-10 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">156ms</div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Database className="w-10 h-10 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">1.2M</div>
            <div className="text-sm text-gray-400">Requests/Hour</div>
          </div>
        </div>
      </div>
    </div>
  );
};