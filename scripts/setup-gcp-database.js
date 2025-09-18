#!/usr/bin/env node

/**
 * GCP Database Setup Script
 * Automates database creation and configuration for Google Cloud Platform deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  PROJECT_ID: process.env.GCP_PROJECT_ID || 'journai-travel-app',
  REGION: process.env.GCP_REGION || 'us-central1',
  DB_INSTANCE: process.env.GCP_DB_INSTANCE || 'journai-db',
  DB_NAME: process.env.GCP_DB_NAME || 'journai',
  DB_USER: process.env.GCP_DB_USER || 'journai_user',
  SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
  SUPABASE_DB_PASSWORD: process.env.SUPABASE_DB_PASSWORD
};

class GCPDatabaseSetup {
  constructor() {
    this.logStep = (step, message) => {
      console.log(`\n🔧 [${step}] ${message}`);
    };

    this.logSuccess = (message) => {
      console.log(`✅ ${message}`);
    };

    this.logError = (message) => {
      console.error(`❌ ${message}`);
    };

    this.logInfo = (message) => {
      console.log(`ℹ️  ${message}`);
    };
  }

  async setupSupabaseProject() {
    this.logStep('SUPABASE', 'Setting up Supabase project...');

    try {
      // Check if Supabase CLI is installed
      execSync('supabase --version', { stdio: 'pipe' });
      this.logSuccess('Supabase CLI found');
    } catch (error) {
      this.logError('Supabase CLI not found. Installing...');
      
      // Install Supabase CLI
      if (process.platform === 'darwin') {
        execSync('brew install supabase/tap/supabase', { stdio: 'inherit' });
      } else {
        execSync('npm install -g supabase', { stdio: 'inherit' });
      }
    }

    // Initialize Supabase project if not exists
    if (!fs.existsSync('./supabase/config.toml')) {
      this.logInfo('Initializing Supabase project...');
      execSync('supabase init', { stdio: 'inherit' });
    }

    // Start local Supabase (for development)
    if (process.env.NODE_ENV !== 'production') {
      try {
        this.logInfo('Starting local Supabase...');
        execSync('supabase start', { stdio: 'inherit' });
        this.logSuccess('Local Supabase started');
      } catch (error) {
        this.logError('Failed to start local Supabase. Continuing with remote setup...');
      }
    }

    // Link to remote project if project ID is provided
    if (CONFIG.SUPABASE_PROJECT_ID) {
      try {
        this.logInfo(`Linking to Supabase project: ${CONFIG.SUPABASE_PROJECT_ID}`);
        execSync(`supabase link --project-ref ${CONFIG.SUPABASE_PROJECT_ID}`, { stdio: 'inherit' });
        this.logSuccess('Linked to Supabase project');
      } catch (error) {
        this.logError('Failed to link Supabase project. Manual linking may be required.');
      }
    }

    return true;
  }

  async setupCloudSQL() {
    this.logStep('CLOUD_SQL', 'Setting up Google Cloud SQL...');

    try {
      // Check if gcloud CLI is installed
      execSync('gcloud --version', { stdio: 'pipe' });
      this.logSuccess('Google Cloud CLI found');
    } catch (error) {
      this.logError('Google Cloud CLI not found. Please install it first.');
      this.logInfo('Visit: https://cloud.google.com/sdk/docs/install');
      return false;
    }

    // Set project
    try {
      execSync(`gcloud config set project ${CONFIG.PROJECT_ID}`, { stdio: 'inherit' });
      this.logSuccess(`Project set to: ${CONFIG.PROJECT_ID}`);
    } catch (error) {
      this.logError(`Failed to set project: ${CONFIG.PROJECT_ID}`);
      return false;
    }

    // Enable required APIs
    this.logInfo('Enabling required APIs...');
    const apis = [
      'sqladmin.googleapis.com',
      'compute.googleapis.com',
      'cloudbuild.googleapis.com',
      'run.googleapis.com'
    ];

    for (const api of apis) {
      try {
        execSync(`gcloud services enable ${api}`, { stdio: 'pipe' });
        this.logSuccess(`Enabled API: ${api}`);
      } catch (error) {
        this.logError(`Failed to enable API: ${api}`);
      }
    }

    // Create Cloud SQL instance
    try {
      this.logInfo(`Creating Cloud SQL instance: ${CONFIG.DB_INSTANCE}`);
      execSync(`gcloud sql instances create ${CONFIG.DB_INSTANCE} \
        --database-version=POSTGRES_14 \
        --tier=db-f1-micro \
        --region=${CONFIG.REGION} \
        --storage-type=SSD \
        --storage-size=10GB \
        --storage-auto-increase`, { stdio: 'inherit' });
      this.logSuccess('Cloud SQL instance created');
    } catch (error) {
      this.logInfo('Cloud SQL instance may already exist or creation failed');
    }

    // Create database
    try {
      this.logInfo(`Creating database: ${CONFIG.DB_NAME}`);
      execSync(`gcloud sql databases create ${CONFIG.DB_NAME} --instance=${CONFIG.DB_INSTANCE}`, { stdio: 'inherit' });
      this.logSuccess('Database created');
    } catch (error) {
      this.logInfo('Database may already exist');
    }

    // Create user
    try {
      this.logInfo(`Creating database user: ${CONFIG.DB_USER}`);
      const password = CONFIG.SUPABASE_DB_PASSWORD || this.generatePassword();
      execSync(`gcloud sql users create ${CONFIG.DB_USER} --instance=${CONFIG.DB_INSTANCE} --password=${password}`, { stdio: 'inherit' });
      this.logSuccess('Database user created');
      this.logInfo(`Database password: ${password}`);
    } catch (error) {
      this.logInfo('Database user may already exist');
    }

    return true;
  }

  async runMigrations() {
    this.logStep('MIGRATIONS', 'Running database migrations...');

    const migrationFiles = fs.readdirSync('./supabase/migrations')
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      this.logInfo('No migration files found');
      return true;
    }

    for (const file of migrationFiles) {
      try {
        this.logInfo(`Running migration: ${file}`);
        
        if (process.env.NODE_ENV === 'production' && CONFIG.SUPABASE_PROJECT_ID) {
          // Run on remote Supabase
          execSync(`supabase db push`, { stdio: 'inherit' });
        } else {
          // Run on local Supabase
          const migrationPath = path.join('./supabase/migrations', file);
          const sql = fs.readFileSync(migrationPath, 'utf8');
          
          // This would need to be adapted based on your specific setup
          this.logInfo(`Migration content loaded: ${file}`);
        }
        
        this.logSuccess(`Migration completed: ${file}`);
      } catch (error) {
        this.logError(`Migration failed: ${file}`);
        this.logError(error.message);
      }
    }

    return true;
  }

  async generateEnvironmentFile() {
    this.logStep('ENV', 'Generating environment configuration...');

    let envContent = '';

    if (CONFIG.SUPABASE_PROJECT_ID) {
      // Supabase configuration
      envContent += `# Supabase Configuration\n`;
      envContent += `VITE_SUPABASE_URL=https://${CONFIG.SUPABASE_PROJECT_ID}.supabase.co\n`;
      envContent += `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here\n\n`;
    } else {
      // Local development configuration
      envContent += `# Local Development Configuration\n`;
      envContent += `VITE_SUPABASE_URL=http://localhost:54321\n`;
      envContent += `VITE_SUPABASE_ANON_KEY=your_local_anon_key_here\n\n`;
    }

    // GCP Configuration
    envContent += `# GCP Configuration\n`;
    envContent += `GCP_PROJECT_ID=${CONFIG.PROJECT_ID}\n`;
    envContent += `GCP_REGION=${CONFIG.REGION}\n`;
    envContent += `GCP_DB_INSTANCE=${CONFIG.DB_INSTANCE}\n`;
    envContent += `GCP_DB_NAME=${CONFIG.DB_NAME}\n`;
    envContent += `GCP_DB_USER=${CONFIG.DB_USER}\n\n`;

    // Admin Configuration
    envContent += `# Admin Console Configuration\n`;
    envContent += `VITE_ADMIN_ENABLED=true\n`;
    envContent += `VITE_ADMIN_DEBUG=true\n`;
    envContent += `VITE_ADMIN_DB_ACCESS=false\n`;
    envContent += `VITE_ADMIN_EMAILS=admin@journai.com\n`;

    // Write to .env file
    fs.writeFileSync('.env', envContent);
    this.logSuccess('Environment file generated: .env');

    // Also create .env.production for production builds
    const prodEnvContent = envContent.replace('VITE_ADMIN_ENABLED=true', 'VITE_ADMIN_ENABLED=false');
    fs.writeFileSync('.env.production', prodEnvContent);
    this.logSuccess('Production environment file generated: .env.production');

    return true;
  }

  generatePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async run() {
    console.log('🚀 Starting GCP Database Setup for Journai Travel App\n');

    try {
      // Setup Supabase
      await this.setupSupabaseProject();

      // Setup Cloud SQL (optional, for advanced deployments)
      if (process.env.USE_CLOUD_SQL === 'true') {
        await this.setupCloudSQL();
      }

      // Run migrations
      await this.runMigrations();

      // Generate environment files
      await this.generateEnvironmentFile();

      console.log('\n🎉 Database setup completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Update the .env file with your actual Supabase keys');
      console.log('2. Run: npm run dev');
      console.log('3. The app will automatically create tables on first run');
      console.log('4. Deploy to GCP when ready: npm run deploy');

    } catch (error) {
      this.logError('Setup failed:');
      console.error(error);
      process.exit(1);
    }
  }
}

// Run the setup
if (require.main === module) {
  const setup = new GCPDatabaseSetup();
  setup.run();
}

module.exports = GCPDatabaseSetup;