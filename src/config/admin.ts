// Admin configuration
export interface AdminConfig {
  enabled: boolean;
  debugMode: boolean;
  features: {
    userManagement: boolean;
    analytics: boolean;
    systemHealth: boolean;
    databaseAdmin: boolean;
  };
}

// This can be controlled via environment variables during build
export const ADMIN_CONFIG: AdminConfig = {
  enabled: import.meta.env.VITE_ADMIN_ENABLED === 'true' || import.meta.env.DEV,
  debugMode: import.meta.env.VITE_ADMIN_DEBUG === 'true',
  features: {
    userManagement: true,
    analytics: true,
    systemHealth: true,
    databaseAdmin: import.meta.env.VITE_ADMIN_DB_ACCESS === 'true'
  }
};

// Admin access control
export const isAdminUser = (user: any): boolean => {
  if (!user) return false;
  
  // Check if user has admin role or is in admin list
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((email: string) => email.trim());
  return adminEmails.includes(user.email) || user.user_metadata?.role === 'admin';
};

export const canAccessAdmin = (user: any): boolean => {
  return ADMIN_CONFIG.enabled && isAdminUser(user);
};