# ENV
# Set the variable value in *.tfvars file

# digital ocean variable
variable "do_token" {}
variable "access_id" {}
variable "secret_key" {}

# env variable
variable "NODE_ENV" {}
variable "BACKEND_PORT" {}
variable "BACKEND_AUTH_PRIVATE_KEY" {}
variable "BACKEND_NODEMAILER_HOST" {}
variable "BACKEND_NODEMAILER_PORT" {}
variable "BACKEND_NODEMAILER_EMAIL" {}
variable "BACKEND_NODEMAILER_PASS" {}
variable "BACKEND_NODEMAILER_SERVICE" {}
variable "BACKEND_FRONTEND_URL" {}

# global variable
variable "digitalocean_region" {
    default = "sgp1"
}

# variable for App Platform
variable "digitalocean_app_spec_name" {
    default = "mare-backend"
}
variable "digitalocean_app_spec_service_name" {
    default = "mare-backend-service"
}
variable "digitalocean_app_spec_service_instant_count" {
    default = 1
}
variable "digitalocean_app_spec_service_instance_size_slug" {
    default = "basic-xs"
}
variable "digitalocean_app_spec_service_git_repo" {
    default = "dewaste-solutions/mare-backend"
}
variable "digitalocean_app_spec_service_git_branch" {
    default = "main"
}

# variable For Database
variable "digitalocean_database_cluster_name" {
    default = "postgres"
}
variable "digitalocean_database_cluster_engine" {
    default = "pg"
}
variable "digitalocean_database_cluster_version" {
    default = "15"
}
variable "digitalocean_database_cluster_size" {
    default = "db-s-1vcpu-1gb"
}
variable "digitalocean_database_cluster_node_count" {
    default = 1
}

# variable For Space Bucket
variable "digitalocean_spaces_bucket_name" {
    default = "backend-bucket"
}
variable "digitalocean_spaces_bucket_acl" {
    default = "private"
}
