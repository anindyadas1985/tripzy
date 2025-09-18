# Terraform configuration for Journai Travel App GCP Infrastructure
# This provides Infrastructure as Code for the complete setup

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "us-central1-a"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "journai-app"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Custom domain name (optional)"
  type        = string
  default     = ""
}

# Provider configuration
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "sqladmin.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "appengine.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "storage.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudscheduler.googleapis.com"
  ])

  service = each.key
  project = var.project_id

  disable_dependent_services = false
  disable_on_destroy         = false
}

# App Engine Application
resource "google_app_engine_application" "app" {
  project       = var.project_id
  location_id   = var.region
  database_type = "CLOUD_DATASTORE_COMPATIBILITY"

  depends_on = [google_project_service.required_apis]
}

# Cloud SQL Instance
resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db-instance"
  database_version = "POSTGRES_14"
  region          = var.region
  project         = var.project_id

  settings {
    tier                        = "db-f1-micro"
    availability_type          = "ZONAL"
    disk_type                  = "PD_SSD"
    disk_size                  = 10
    disk_autoresize           = true
    disk_autoresize_limit     = 100

    backup_configuration {
      enabled                        = true
      start_time                    = "03:00"
      location                      = var.region
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    maintenance_window {
      day          = 7  # Sunday
      hour         = 4  # 4 AM
      update_track = "stable"
    }

    database_flags {
      name  = "log_checkpoints"
      value = "on"
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }

    database_flags {
      name  = "log_disconnections"
      value = "on"
    }

    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = true
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
  }

  deletion_protection = true

  depends_on = [google_project_service.required_apis]
}

# Database
resource "google_sql_database" "database" {
  name     = "journai_db"
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}

# Database User
resource "google_sql_user" "user" {
  name     = "journai_user"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
  project  = var.project_id
}

# Random password for database
resource "random_password" "db_password" {
  length  = 16
  special = true
}

# Secret Manager secrets
resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password"
  project   = var.project_id

  replication {
    automatic = true
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result
}

resource "google_secret_manager_secret" "supabase_url" {
  secret_id = "supabase-url"
  project   = var.project_id

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "supabase_url" {
  secret      = google_secret_manager_secret.supabase_url.id
  secret_data = "https://your-project.supabase.co"
}

resource "google_secret_manager_secret" "supabase_anon_key" {
  secret_id = "supabase-anon-key"
  project   = var.project_id

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "supabase_anon_key" {
  secret      = google_secret_manager_secret.supabase_anon_key.id
  secret_data = "your-supabase-anon-key"
}

resource "google_secret_manager_secret" "admin_emails" {
  secret_id = "admin-emails"
  project   = var.project_id

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "admin_emails" {
  secret      = google_secret_manager_secret.admin_emails.id
  secret_data = "admin@journai.com"
}

# Cloud Storage bucket for static assets
resource "google_storage_bucket" "static_assets" {
  name          = "${var.project_id}-static-assets"
  location      = var.region
  project       = var.project_id
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

# Cloud Storage bucket for backups
resource "google_storage_bucket" "backups" {
  name          = "${var.project_id}-backups"
  location      = var.region
  project       = var.project_id
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}

# Cloud Scheduler job for database backups
resource "google_cloud_scheduler_job" "db_backup" {
  name        = "${var.app_name}-db-backup"
  description = "Daily database backup"
  schedule    = "0 2 * * *"  # Daily at 2 AM
  time_zone   = "UTC"
  project     = var.project_id
  region      = var.region

  http_target {
    http_method = "POST"
    uri         = "https://sqladmin.googleapis.com/sql/v1beta4/projects/${var.project_id}/instances/${google_sql_database_instance.main.name}/export"
    
    headers = {
      "Content-Type" = "application/json"
    }

    body = base64encode(jsonencode({
      exportContext = {
        kind     = "sql#exportContext"
        fileType = "SQL"
        uri      = "gs://${google_storage_bucket.backups.name}/backups/db-backup-$(date +%Y%m%d-%H%M%S).sql"
        databases = [google_sql_database.database.name]
      }
    }))

    oauth_token {
      service_account_email = google_service_account.backup_service.email
    }
  }

  depends_on = [google_project_service.required_apis]
}

# Service account for backups
resource "google_service_account" "backup_service" {
  account_id   = "${var.app_name}-backup"
  display_name = "Backup Service Account"
  project      = var.project_id
}

# IAM bindings for backup service account
resource "google_project_iam_member" "backup_sql_admin" {
  project = var.project_id
  role    = "roles/cloudsql.admin"
  member  = "serviceAccount:${google_service_account.backup_service.email}"
}

resource "google_project_iam_member" "backup_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.backup_service.email}"
}

# Monitoring notification channel
resource "google_monitoring_notification_channel" "email" {
  display_name = "Admin Email"
  type         = "email"
  project      = var.project_id

  labels = {
    email_address = "admin@journai.com"
  }

  depends_on = [google_project_service.required_apis]
}

# Monitoring alert policies
resource "google_monitoring_alert_policy" "high_cpu" {
  display_name = "High CPU Usage"
  project      = var.project_id

  conditions {
    display_name = "CPU usage above 80%"

    condition_threshold {
      filter          = "resource.type=\"gae_app\""
      comparison      = "COMPARISON_GREATER_THAN"
      threshold_value = 0.8
      duration        = "300s"

      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]

  alert_strategy {
    auto_close = "1800s"
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_monitoring_alert_policy" "high_memory" {
  display_name = "High Memory Usage"
  project      = var.project_id

  conditions {
    display_name = "Memory usage above 85%"

    condition_threshold {
      filter          = "resource.type=\"gae_app\""
      comparison      = "COMPARISON_GREATER_THAN"
      threshold_value = 0.85
      duration        = "300s"

      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]

  alert_strategy {
    auto_close = "1800s"
  }

  depends_on = [google_project_service.required_apis]
}

# Custom domain mapping (if domain is provided)
resource "google_app_engine_domain_mapping" "domain" {
  count       = var.domain_name != "" ? 1 : 0
  domain_name = var.domain_name
  project     = var.project_id

  ssl_settings {
    ssl_management_type = "AUTOMATIC"
  }

  depends_on = [google_app_engine_application.app]
}

# Outputs
output "app_engine_url" {
  description = "App Engine application URL"
  value       = "https://${var.project_id}.appspot.com"
}

output "database_connection_name" {
  description = "Database connection name"
  value       = google_sql_database_instance.main.connection_name
}

output "database_ip" {
  description = "Database IP address"
  value       = google_sql_database_instance.main.ip_address.0.ip_address
}

output "static_bucket_url" {
  description = "Static assets bucket URL"
  value       = "gs://${google_storage_bucket.static_assets.name}"
}

output "backup_bucket_url" {
  description = "Backup bucket URL"
  value       = "gs://${google_storage_bucket.backups.name}"
}

output "custom_domain_url" {
  description = "Custom domain URL (if configured)"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "Not configured"
}