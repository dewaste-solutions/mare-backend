# https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli
# https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs\
#  - Resources : create something
#  - Data Sources : read only

# terraform init    # (first time only - to initialize plugins)
# terraform plan    # (see what it will do)
# terraform apply   # (actually deploy it)
# terraform destroy # (destroy)


terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token

  spaces_access_id  = var.access_id
  spaces_secret_key = var.secret_key
}
