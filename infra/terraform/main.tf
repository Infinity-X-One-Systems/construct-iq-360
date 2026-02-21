/**
 * Construct-OS Infrastructure — Terraform
 * ========================================
 * Provisions:
 *   - GCP project services (Vertex AI, AutoML, Cloud Run)
 *   - Service account for agents
 *   - GitHub Actions self-hosted runner (optional)
 *
 * Usage:
 *   terraform init
 *   terraform plan -var-file=terraform.tfvars
 *   terraform apply -var-file=terraform.tfvars
 */

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }

  # Remote state — update bucket name for your org
  backend "gcs" {
    bucket = "construct-os-tfstate"
    prefix = "terraform/state"
  }
}

# ─── PROVIDERS ────────────────────────────────────────────────────────────────

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

provider "github" {
  owner = var.github_org
}

# ─── VARIABLES ────────────────────────────────────────────────────────────────

variable "gcp_project_id" {
  description = "GCP project ID for Vertex AI and Cloud Run"
  type        = string
}

variable "gcp_region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "github_org" {
  description = "GitHub organization name"
  type        = string
  default     = "InfinityXOneSystems"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "construct-iq-360"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

# ─── GCP SERVICES ─────────────────────────────────────────────────────────────

resource "google_project_service" "vertex_ai" {
  service            = "aiplatform.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "automl" {
  service            = "automl.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_run" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "secret_manager" {
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_storage" {
  service            = "storage.googleapis.com"
  disable_on_destroy = false
}

# ─── SERVICE ACCOUNT ──────────────────────────────────────────────────────────

resource "google_service_account" "construct_os_agent" {
  account_id   = "construct-os-agent"
  display_name = "Construct-OS Agent Service Account"
  description  = "Used by biz-ops agents for Vertex AI, AutoML, and storage access"
}

resource "google_project_iam_member" "vertex_ai_user" {
  project = var.gcp_project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.construct_os_agent.email}"
}

resource "google_project_iam_member" "automl_editor" {
  project = var.gcp_project_id
  role    = "roles/automl.editor"
  member  = "serviceAccount:${google_service_account.construct_os_agent.email}"
}

resource "google_project_iam_member" "storage_object_admin" {
  project = var.gcp_project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.construct_os_agent.email}"
}

# ─── STORAGE ──────────────────────────────────────────────────────────────────

resource "google_storage_bucket" "agent_data" {
  name          = "${var.gcp_project_id}-construct-os-data"
  location      = var.gcp_region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age        = 365
      with_state = "ARCHIVED"
    }
  }

  labels = {
    environment = var.environment
    system      = "construct-os"
  }
}

# ─── GITHUB ACTIONS RUNNER (Self-Hosted) ─────────────────────────────────────

resource "github_actions_runner_group" "construct_os" {
  name       = "construct-os-runners"
  visibility = "selected"
  selected_repository_ids = [
    data.github_repository.construct_iq_360.repo_id
  ]
}

data "github_repository" "construct_iq_360" {
  name = var.github_repo
}

# ─── OUTPUTS ──────────────────────────────────────────────────────────────────

output "service_account_email" {
  description = "Agent service account email"
  value       = google_service_account.construct_os_agent.email
}

output "data_bucket" {
  description = "GCS bucket for agent data"
  value       = google_storage_bucket.agent_data.name
}

output "vertex_ai_endpoint" {
  description = "Vertex AI regional endpoint"
  value       = "https://${var.gcp_region}-aiplatform.googleapis.com"
}
