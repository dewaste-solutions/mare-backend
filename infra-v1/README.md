# DigitalOcean Infrastructure Setup

This repository contains Terraform configurations to manage DigitalOcean infrastructure for development and production environments.

## Prerequisites

- [DigitalOcean Account](https://cloud.digitalocean.com/registrations/new)
- [DigitalOcean Personal Access Token](https://cloud.digitalocean.com/account/api/tokens)

## Repository Structure

```
infra-v1/
├── README.md
└── env/
    ├── dev/                 # Development environment
    │   ├── main.tf
    │   ├── providers.tf
    │   ├── variables.tf
    │   └── terraform.tfvars
    └── prod/                # Production environment
        ├── main.tf
        ├── providers.tf
        ├── variables.tf
        └── terraform.tfvars
```

## Getting Started

1. Clone the repository:
```sh
git clone <repository-url>
cd infra-v1
```

2. Navigate to your desired environment:
```sh
cd env/dev  # For development
# or
cd env/prod # For production
```

3. Create a `terraform.tfvars` file with your DigitalOcean credentials:
```hcl
do_token="xxx"
access_id="xxx"
secret_key="xxx"
NODE_ENV="development"
BACKEND_PORT=8080
BACKEND_AUTH_PRIVATE_KEY="xxx"
BACKEND_NODEMAILER_HOST="smtp.gmail.com"
BACKEND_NODEMAILER_PORT=587
BACKEND_NODEMAILER_EMAIL="xxx"
BACKEND_NODEMAILER_PASS="xxx"
BACKEND_NODEMAILER_SERVICE="gmail"
BACKEND_FRONTEND_URL="xxx"
CA_CERT=""
```

4. Initialize Terraform:
```sh
terraform init
```

5. Review the infrastructure plan:
```sh
terraform plan
```

6. Apply the configuration:
```sh
terraform apply
```

7. Setting up SSL Certificate for Database Connection

### Download and Format Certificate
1. Download the CA certificate from your DigitalOcean database dashboard
2. Save it as `ca-certificate.crt`
3. Convert the certificate to a single line format using one of these methods:

**Using Bash/Git Bash:**
```bash
cat ca-certificate.crt | awk '{printf "%s\\n", $0}' | tr -d '\n'
```

**Using PowerShell:**
```powershell
(Get-Content ca-certificate.crt -Raw) -replace "`r`n", "\n" -replace "`n", "\n"
```

### Update App Platform Configuration
1. Copy the converted certificate string
2. Go to your DigitalOcean App Platform dashboard
3. Navigate to your app's Environment Variables
4. Find or create the `CA_CERT` variable
5. Paste the converted certificate string as the value
6. Save the changes
7. Restart your application to apply the new certificate

### Verify Connection
- Check your application logs to ensure the database connection is successful
- Test your application's database-dependent features


## Managing Infrastructure

### Creating Resources
```sh
terraform apply
```

### Updating Resources
1. Make changes to the terraform files
2. Run:
```sh
terraform plan
terraform apply
```

### Destroying Resources
```sh
terraform destroy
```

## Important Notes

- Always review the plan output before applying changes
- Keep your DigitalOcean API token secure and never commit it to version control
- Use terraform workspaces if you need to manage multiple instances of the same environment
- Make sure to back up your Terraform state files
- In App Platform, when you change the environment variable, it will force a redeployment