# Create Database
resource "digitalocean_database_postgresql_config" "postgres-config" {
  cluster_id = digitalocean_database_cluster.postgres.id
  timezone   = "UTC"
}
resource "digitalocean_database_cluster" "postgres" {
  name       = var.digitalocean_database_cluster_name
  engine     = var.digitalocean_database_cluster_engine
  version    = var.digitalocean_database_cluster_version
  size       = var.digitalocean_database_cluster_size
  region     = var.digitalocean_region
  node_count = var.digitalocean_database_cluster_node_count
}
data "digitalocean_database_ca" "ca" {
  cluster_id = digitalocean_database_cluster.postgres.id
}

# Create Space Bucket
resource "digitalocean_spaces_bucket" "bucket" {
  name   = var.digitalocean_spaces_bucket_name
  region = var.digitalocean_region
  acl = var.digitalocean_spaces_bucket_acl
}

# Create App Platform
resource "digitalocean_app" "mare-backend" {
  spec {
    name   = var.digitalocean_app_spec_name
    region = var.digitalocean_region
    env {
      key = "NODE_ENV"
      value = var.NODE_ENV
    }
    env {
      key = "DATABASE_NAME"
      value = digitalocean_database_cluster.postgres.database
    }
    env {
      key = "DATABASE_PASSWORD"
      value = digitalocean_database_cluster.postgres.password
    }
    env {
      key = "DATABASE_HOST"
      value = digitalocean_database_cluster.postgres.host
    }
    env {
      key = "DATABASE_PORT"
      value = digitalocean_database_cluster.postgres.port
    }
    env {
      key = "DATABASE_USER"
      value = digitalocean_database_cluster.postgres.user
    }
    env {
      key = "BACKEND_PORT"
      value = var.BACKEND_PORT
    }
    env {
      key = "BACKEND_AUTH_PRIVATE_KEY"
      value = var.BACKEND_AUTH_PRIVATE_KEY
    }
    env {
      key = "BACKEND_NODEMAILER_HOST"
      value = var.BACKEND_NODEMAILER_HOST
    }
    env {
      key = "BACKEND_NODEMAILER_PORT"
      value = var.BACKEND_NODEMAILER_PORT
    }
    env {
      key = "BACKEND_NODEMAILER_EMAIL"
      value = var.BACKEND_NODEMAILER_EMAIL
    }
    env {
      key = "BACKEND_NODEMAILER_PASS"
      value = var.BACKEND_NODEMAILER_PASS
    }
    env {
      key = "BACKEND_NODEMAILER_SERVICE"
      value = var.BACKEND_NODEMAILER_SERVICE
    }
    env {
      key = "BACKEND_FRONTEND_URL"
      value = var.BACKEND_FRONTEND_URL
    }
    env {
      key = "CA_CERT"
      value = replace(data.digitalocean_database_ca.ca.certificate, "\n", "\\n")
    }

    job {
      name = "db-migration"
      kind = "POST_DEPLOY"

      github {
        repo = var.digitalocean_app_spec_service_git_repo
        branch = var.digitalocean_app_spec_service_git_branch
        deploy_on_push = true
      }

      instance_count = 1
      instance_size_slug = "basic-xxs"

      run_command = "npm run db:migrate && npm run db:push"
    }

    service {
      name               = var.digitalocean_app_spec_service_name
      instance_count     = var.digitalocean_app_spec_service_instant_count
      instance_size_slug = var.digitalocean_app_spec_service_instance_size_slug

      github {
        repo = var.digitalocean_app_spec_service_git_repo
        branch = var.digitalocean_app_spec_service_git_branch
        deploy_on_push = true
      }
      run_command = "npm run start"
    }
  }
}