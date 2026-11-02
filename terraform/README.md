# FindX — Terraform Infrastructure

Provisions the AWS resources for FindX: VPC (public + private subnets),
EC2 instance (runs Docker Compose stack), RDS PostgreSQL, S3 bucket for
item images, IAM role/instance profile, and security groups.

## Usage

```bash
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars with your key pair name, DB password, bucket name, IP

terraform init
terraform plan
terraform apply
```

## After apply

1. SSH into the EC2 instance using the `ec2_public_ip` output.
2. Copy `docker-compose.yml`, `backend/`, `frontend/` (or just pull pushed
   images) into `/opt/findx` on the instance.
3. Set `DB_URL` to the `rds_endpoint` output and `AWS_S3_BUCKET` to the
   `s3_bucket_name` output as environment variables for the backend service.
4. Run `docker compose up -d`.

## Destroy

```bash
terraform destroy
```
