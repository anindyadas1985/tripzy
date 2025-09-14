import { databaseSetup } from './database-setup';

// Database initialization utility
export class DatabaseInitializer {
  private static isInitialized = false;
  private static initPromise: Promise<void> | null = null;

  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private static async performInitialization(): Promise<void> {
    try {
      console.log('🚀 Starting database initialization...');
      
      const result = await databaseSetup.initializeDatabase();
      
      if (result.success) {
        console.log('✅ Database initialization completed successfully');
        this.isInitialized = true;
      } else {
        console.warn('⚠️ Database initialization completed with warnings:', result.message);
        // Still mark as initialized to avoid repeated attempts
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      // Don't mark as initialized so it can be retried
      this.initPromise = null;
      throw error;
    }
  }

  static isReady(): boolean {
    return this.isInitialized;
  }

  static async waitForInitialization(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    return this.initialize();
  }
}

// Auto-initialize when module is imported (in browser environment)
if (typeof window !== 'undefined') {
  // Delay initialization to avoid blocking app startup
  setTimeout(() => {
    DatabaseInitializer.initialize().catch(error => {
      console.error('Auto-initialization failed:', error);
    });
  }, 2000);
}

export const dbInit = DatabaseInitializer;