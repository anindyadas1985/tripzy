#!/bin/bash

# Journai Travel App - GCP Infrastructure Setup
# This script sets up complete infrastructure on Google Cloud Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="journai-travel-app"
REGION="us-central1"
ZONE="us-central1-a"
APP_NAME="journai"
DOMAIN_NAME="" # Will be set during setup

echo -e "${BLUE}🚀 Journai Travel App - GCP Infrastructure Setup${NC}"
echo -e "${BLUE}=================================================${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud SDK is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_warning "Not authenticated with Google Cloud. Please run:"
    echo "gcloud auth login"
    exit 1
fi

# Step 1: Create or select project
echo -e "\n${BLUE}📋 Step 1: Project Setup${NC}"
read -p "Enter your GCP Project ID (or press Enter to create new): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID="${PROJECT_NAME}-$(date +%s)"
    echo "Creating new project: $PROJECT_ID"
    gcloud projects create $PROJECT_ID --name="$PROJECT_NAME"
    print_status "Project created: $PROJECT_ID"
else
    echo "Using existing project: $PROJECT_ID"
fi

gcloud config set project $PROJECT_ID
print_status "Project configured"

# Step 2: Enable required APIs
echo -e "\n${BLUE}🔧 Step 2: Enabling APIs${NC}"
APIS=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "sql-component.googleapis.com"
    "sqladmin.googleapis.com"
    "compute.googleapis.com"
    "container.googleapis.com"
    "artifactregistry.googleapis.com"
    "cloudresourcemanager.googleapis.com"
    "iam.googleapis.com"
    "secretmanager.googleapis.com"
    "dns.googleapis.com"
)

for api in "${APIS[@]}"; do
    echo "Enabling $api..."
    gcloud services enable $api
done
print_status "All APIs enabled"

# Step 3: Create PostgreSQL database
echo -e "\n${BLUE}🗄️  Step 3: Database Setup${NC}"
DB_INSTANCE_NAME="${APP_NAME}-db"
DB_NAME="journai_db"
DB_USER="journai_user"
DB_PASSWORD=$(openssl rand -base64 32)

echo "Creating Cloud SQL PostgreSQL instance..."
gcloud sql instances create $DB_INSTANCE_NAME \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-type=SSD \
    --storage-size=10GB \
    --backup-start-time=03:00 \
    --enable-bin-log \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=04

print_status "Database instance created"

# Create database and user
echo "Creating database and user..."
gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE_NAME
gcloud sql users create $DB_USER --instance=$DB_INSTANCE_NAME --password=$DB_PASSWORD

print_status "Database and user created"

# Step 4: Store secrets
echo -e "\n${BLUE}🔐 Step 4: Secrets Management${NC}"
echo "Storing database credentials in Secret Manager..."

echo -n "$DB_PASSWORD" | gcloud secrets create db-password --data-file=-
echo -n "postgresql://$DB_USER:$DB_PASSWORD@/cloudsql/$PROJECT_ID:$REGION:$DB_INSTANCE_NAME/$DB_NAME" | gcloud secrets create database-url --data-file=-

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 64)
echo -n "$JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-

print_status "Secrets stored securely"

# Step 5: Create Artifact Registry
echo -e "\n${BLUE}📦 Step 5: Container Registry${NC}"
REPO_NAME="${APP_NAME}-repo"

gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Journai Travel App container repository"

print_status "Artifact Registry created"

# Step 6: Build and deploy application
echo -e "\n${BLUE}🏗️  Step 6: Application Deployment${NC}"

# Create Dockerfile
cat > Dockerfile << 'EOF'
# Multi-stage build for React app
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx configuration
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

# Create Cloud Build configuration
cat > cloudbuild.yaml << EOF
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', '$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$APP_NAME:latest', '.']
  
  # Push the container image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$APP_NAME:latest']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - '$APP_NAME'
      - '--image'
      - '$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$APP_NAME:latest'
      - '--region'
      - '$REGION'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'NODE_ENV=production'
      - '--set-secrets'
      - 'DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest'
      - '--add-cloudsql-instances'
      - '$PROJECT_ID:$REGION:$DB_INSTANCE_NAME'
      - '--memory'
      - '512Mi'
      - '--cpu'
      - '1'
      - '--min-instances'
      - '0'
      - '--max-instances'
      - '10'

options:
  logging: CLOUD_LOGGING_ONLY
EOF

# Build and deploy
echo "Building and deploying application..."
gcloud builds submit --config cloudbuild.yaml

print_status "Application deployed to Cloud Run"

# Step 7: Set up database schema
echo -e "\n${BLUE}🗃️  Step 7: Database Schema Setup${NC}"

# Get Cloud Run service URL
SERVICE_URL=$(gcloud run services describe $APP_NAME --region=$REGION --format="value(status.url)")

# Create a temporary Cloud SQL Proxy connection for schema setup
echo "Setting up database schema..."
gcloud sql connect $DB_INSTANCE_NAME --user=$DB_USER --database=$DB_NAME << 'EOF'
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  user_type text NOT NULL DEFAULT 'traveler',
  preferences jsonb DEFAULT '{}',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'planning',
  style text NOT NULL DEFAULT 'leisure',
  pace text NOT NULL DEFAULT 'moderate',
  budget decimal(10, 2) DEFAULT 0,
  spent decimal(10, 2) DEFAULT 0,
  currency text DEFAULT 'INR',
  travelers integer DEFAULT 1,
  preferences text[] DEFAULT '{}',
  image text,
  share_code text UNIQUE,
  is_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  provider text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  price decimal(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  confirmation_code text,
  booking_date timestamptz NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  is_read boolean DEFAULT false,
  sent_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

\q
EOF

print_status "Database schema created"

# Step 8: Configure domain (optional)
echo -e "\n${BLUE}🌐 Step 8: Domain Configuration (Optional)${NC}"
read -p "Do you want to configure a custom domain? (y/n): " configure_domain

if [ "$configure_domain" = "y" ]; then
    read -p "Enter your domain name (e.g., journai.com): " DOMAIN_NAME
    
    if [ ! -z "$DOMAIN_NAME" ]; then
        # Create managed SSL certificate
        gcloud compute ssl-certificates create ${APP_NAME}-ssl-cert \
            --domains=$DOMAIN_NAME \
            --global
        
        # Map domain to Cloud Run service
        gcloud run domain-mappings create \
            --service=$APP_NAME \
            --domain=$DOMAIN_NAME \
            --region=$REGION
        
        print_status "Domain mapping created for $DOMAIN_NAME"
        print_warning "Please update your DNS records to point to Google Cloud Run"
    fi
fi

# Step 9: Set up monitoring and logging
echo -e "\n${BLUE}📊 Step 9: Monitoring Setup${NC}"

# Create log-based metrics
gcloud logging metrics create app_errors \
    --description="Application errors" \
    --log-filter='resource.type="cloud_run_revision" AND severity>=ERROR'

# Create alerting policy
cat > alerting-policy.json << EOF
{
  "displayName": "Journai App Error Rate",
  "conditions": [
    {
      "displayName": "High error rate",
      "conditionThreshold": {
        "filter": "metric.type=\"logging.googleapis.com/user/app_errors\"",
        "comparison": "COMPARISON_GREATER_THAN",
        "thresholdValue": 5,
        "duration": "300s"
      }
    }
  ],
  "alertStrategy": {
    "autoClose": "1800s"
  },
  "enabled": true
}
EOF

gcloud alpha monitoring policies create --policy-from-file=alerting-policy.json

print_status "Monitoring and alerting configured"

# Step 10: Create backup strategy
echo -e "\n${BLUE}💾 Step 10: Backup Configuration${NC}"

# Enable automated backups for Cloud SQL
gcloud sql instances patch $DB_INSTANCE_NAME \
    --backup-start-time=02:00 \
    --retained-backups-count=7 \
    --retained-transaction-log-days=7

print_status "Automated backups configured"

# Cleanup temporary files
rm -f Dockerfile nginx.conf cloudbuild.yaml alerting-policy.json

# Final summary
echo -e "\n${GREEN}🎉 DEPLOYMENT COMPLETE! 🎉${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}📱 Application URL:${NC} $SERVICE_URL"
echo -e "${BLUE}🗄️  Database Instance:${NC} $DB_INSTANCE_NAME"
echo -e "${BLUE}📦 Container Registry:${NC} $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME"
echo -e "${BLUE}🔐 Secrets:${NC} Stored in Google Secret Manager"

if [ ! -z "$DOMAIN_NAME" ]; then
    echo -e "${BLUE}🌐 Custom Domain:${NC} https://$DOMAIN_NAME"
    echo -e "${YELLOW}⚠️  Don't forget to update your DNS records!${NC}"
fi

echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. Visit your application at: $SERVICE_URL"
echo "2. Test the registration and login functionality"
echo "3. Create your first trip to verify database connectivity"
echo "4. Monitor logs: gcloud logs tail --service=$APP_NAME"
echo "5. View metrics: https://console.cloud.google.com/monitoring"

echo ""
echo -e "${BLUE}💡 Useful Commands:${NC}"
echo "• View logs: gcloud logs tail --service=$APP_NAME"
echo "• Update app: gcloud builds submit --config cloudbuild.yaml"
echo "• Scale app: gcloud run services update $APP_NAME --max-instances=20"
echo "• Connect to DB: gcloud sql connect $DB_INSTANCE_NAME --user=$DB_USER"

echo ""
echo -e "${GREEN}✅ Your Journai Travel App is now live and operational!${NC}"