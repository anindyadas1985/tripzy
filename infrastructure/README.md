# Journai Travel App - Infrastructure Setup

This directory contains everything needed to deploy the Journai Travel App to Google Cloud Platform (GCP) with complete automation.

## 🚀 Quick Start

### Option 1: Automated Shell Script (Recommended)

```bash
# Make the script executable
chmod +x infrastructure/setup.sh

# Run the setup
./infrastructure/setup.sh
```

This script will:
- ✅ Create/configure GCP project
- ✅ Enable all required APIs
- ✅ Set up PostgreSQL database
- ✅ Configure secrets management
- ✅ Build and deploy the application
- ✅ Set up monitoring and backups
- ✅ Configure custom domain (optional)

### Option 2: Terraform (Infrastructure as Code)

```bash
cd infrastructure/terraform

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your project details

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply
```

### Option 3: Local Development

```bash
# Start local environment with Docker
cd infrastructure
docker-compose up -d

# Access the app at http://localhost
```

## 📋 Prerequisites

### For GCP Deployment:
- Google Cloud SDK installed
- Authenticated with `gcloud auth login`
- Billing enabled on your GCP project

### For Local Development:
- Docker and Docker Compose installed
- Node.js 18+ (if running without Docker)

## 🏗️ Infrastructure Components

### Core Services
- **Cloud Run**: Serverless container hosting
- **Cloud SQL**: Managed PostgreSQL database
- **Artifact Registry**: Container image storage
- **Secret Manager**: Secure credential storage

### Security & Monitoring
- **IAM**: Proper service account permissions
- **SSL Certificates**: Automatic HTTPS
- **Cloud Monitoring**: Error tracking and alerts
- **Cloud Logging**: Centralized log management

### Backup & Recovery
- **Automated Backups**: Daily database backups
- **Point-in-time Recovery**: 7-day transaction log retention
- **Multi-region Replication**: Optional for high availability

## 🔧 Configuration

### Environment Variables
The setup automatically configures:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Authentication token secret
- `NODE_ENV`: Production environment flag

### Database Schema
The database schema is automatically created with:
- Users and authentication
- Trip planning and management
- Booking and reservation tracking
- Expense sharing and splitting
- Real-time notifications

## 🌐 Custom Domain Setup

To use your own domain:

1. **During Setup**: Enter your domain when prompted
2. **DNS Configuration**: Update your domain's DNS records:
   ```
   Type: CNAME
   Name: @
   Value: ghs.googlehosted.com
   ```
3. **SSL Certificate**: Automatically provisioned by Google

## 📊 Monitoring & Maintenance

### View Application Logs
```bash
gcloud logs tail --service=journai
```

### Monitor Performance
```bash
# View service details
gcloud run services describe journai --region=us-central1

# Check database status
gcloud sql instances describe journai-db
```

### Update Application
```bash
# Rebuild and redeploy
gcloud builds submit --config cloudbuild.yaml
```

### Scale Application
```bash
# Increase max instances
gcloud run services update journai --max-instances=20
```

## 💰 Cost Optimization

### Estimated Monthly Costs (USD):
- **Cloud Run**: $0-20 (pay per use)
- **Cloud SQL**: $7-15 (db-f1-micro)
- **Storage**: $1-5 (images, backups)
- **Networking**: $0-10 (data transfer)

**Total**: ~$10-50/month for moderate usage

### Cost Reduction Tips:
- Use Cloud Run's pay-per-use model
- Enable auto-scaling with min instances = 0
- Use db-f1-micro for development
- Implement caching to reduce database calls

## 🔒 Security Best Practices

### Implemented Security Measures:
- ✅ Service accounts with minimal permissions
- ✅ Secrets stored in Secret Manager
- ✅ Database access restricted to Cloud Run
- ✅ HTTPS enforced with managed certificates
- ✅ Regular security updates via container rebuilds

### Additional Recommendations:
- Enable VPC for network isolation
- Use Cloud Armor for DDoS protection
- Implement rate limiting
- Regular security audits

## 🚨 Troubleshooting

### Common Issues:

**Build Failures:**
```bash
# Check build logs
gcloud builds log [BUILD_ID]
```

**Database Connection Issues:**
```bash
# Test database connectivity
gcloud sql connect journai-db --user=journai_user
```

**Service Not Accessible:**
```bash
# Check service status
gcloud run services describe journai --region=us-central1
```

### Support Resources:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Cloud Run Troubleshooting](https://cloud.google.com/run/docs/troubleshooting)
- [Cloud SQL Troubleshooting](https://cloud.google.com/sql/docs/troubleshooting)

## 🔄 CI/CD Pipeline

The setup includes a basic CI/CD pipeline using Cloud Build:

1. **Code Push**: Triggers automatic build
2. **Container Build**: Creates optimized Docker image
3. **Security Scan**: Checks for vulnerabilities
4. **Deploy**: Updates Cloud Run service
5. **Health Check**: Verifies deployment success

## 📈 Scaling Strategy

### Horizontal Scaling:
- Cloud Run auto-scales based on traffic
- Configure max instances based on expected load
- Use Cloud Load Balancer for multiple regions

### Vertical Scaling:
- Increase CPU/memory allocation
- Upgrade database tier as needed
- Use Cloud CDN for static assets

## 🎯 Next Steps

After deployment:

1. **Test the Application**: Visit the provided URL
2. **Configure Monitoring**: Set up custom alerts
3. **Backup Strategy**: Verify automated backups
4. **Performance Tuning**: Monitor and optimize
5. **Security Review**: Regular security assessments

---

**🎉 Your Journai Travel App is now production-ready on Google Cloud Platform!**

For support or questions, refer to the troubleshooting section or check the Google Cloud documentation.