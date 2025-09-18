#!/usr/bin/env node

/**
 * Health Check Script for Journai Travel App
 * Monitors application health and sends alerts
 */

const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

class HealthChecker {
  constructor() {
    this.config = {
      url: process.env.APP_URL || 'http://localhost:8080',
      timeout: 10000,
      retries: 3,
      interval: 30000,
      alertEmail: process.env.ALERT_EMAIL || 'admin@journai.com'
    };
  }

  async checkHealth(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, this.config.timeout);

      const req = client.get(url, (res) => {
        clearTimeout(timeout);
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            responseTime: Date.now() - startTime
          });
        });
      });

      const startTime = Date.now();
      req.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  async checkDatabase() {
    try {
      // This would typically check database connectivity
      // For now, we'll simulate a database check
      return { status: 'healthy', responseTime: 50 };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkDependencies() {
    const checks = {
      supabase: await this.checkSupabase(),
      storage: await this.checkStorage(),
      secrets: await this.checkSecrets()
    };

    return checks;
  }

  async checkSupabase() {
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) return { status: 'not_configured' };

      const response = await this.checkHealth(`${supabaseUrl}/rest/v1/`);
      return { 
        status: response.statusCode === 200 ? 'healthy' : 'unhealthy',
        responseTime: response.responseTime
      };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkStorage() {
    try {
      // Check if we can access Google Cloud Storage
      execSync('gsutil ls', { stdio: 'pipe' });
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: 'Storage access failed' };
    }
  }

  async checkSecrets() {
    try {
      // Check if we can access Secret Manager
      execSync('gcloud secrets list --limit=1', { stdio: 'pipe' });
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: 'Secrets access failed' };
    }
  }

  async sendAlert(message) {
    try {
      console.log(`🚨 ALERT: ${message}`);
      
      // In production, you would send this via email, Slack, etc.
      // For now, we'll log it and optionally use gcloud logging
      if (process.env.GCP_PROJECT_ID) {
        execSync(`gcloud logging write journai-health-alerts "${message}" --severity=ERROR`, { stdio: 'pipe' });
      }
    } catch (error) {
      console.error('Failed to send alert:', error.message);
    }
  }

  async runHealthCheck() {
    console.log('🏥 Running health check...');
    
    const results = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      checks: {}
    };

    try {
      // Check main application
      const appCheck = await this.checkHealth(this.config.url);
      results.checks.application = {
        status: appCheck.statusCode === 200 ? 'healthy' : 'unhealthy',
        statusCode: appCheck.statusCode,
        responseTime: appCheck.responseTime
      };

      if (appCheck.statusCode !== 200) {
        results.overall = 'unhealthy';
        await this.sendAlert(`Application health check failed: HTTP ${appCheck.statusCode}`);
      }

      // Check database
      const dbCheck = await this.checkDatabase();
      results.checks.database = dbCheck;

      if (dbCheck.status !== 'healthy') {
        results.overall = 'unhealthy';
        await this.sendAlert(`Database health check failed: ${dbCheck.error || 'Unknown error'}`);
      }

      // Check dependencies
      const depChecks = await this.checkDependencies();
      results.checks.dependencies = depChecks;

      for (const [service, check] of Object.entries(depChecks)) {
        if (check.status === 'unhealthy') {
          results.overall = 'degraded';
          await this.sendAlert(`${service} dependency check failed: ${check.error || 'Unknown error'}`);
        }
      }

      // Log results
      console.log('📊 Health Check Results:');
      console.log(JSON.stringify(results, null, 2));

      return results;

    } catch (error) {
      results.overall = 'unhealthy';
      results.error = error.message;
      
      await this.sendAlert(`Health check failed: ${error.message}`);
      console.error('❌ Health check failed:', error);
      
      return results;
    }
  }

  startMonitoring() {
    console.log(`🔄 Starting health monitoring (interval: ${this.config.interval}ms)`);
    
    // Run initial check
    this.runHealthCheck();
    
    // Set up periodic checks
    setInterval(() => {
      this.runHealthCheck();
    }, this.config.interval);
  }
}

// CLI usage
if (require.main === module) {
  const checker = new HealthChecker();
  
  const command = process.argv[2];
  
  if (command === 'monitor') {
    checker.startMonitoring();
  } else {
    checker.runHealthCheck().then((results) => {
      process.exit(results.overall === 'healthy' ? 0 : 1);
    });
  }
}

module.exports = HealthChecker;