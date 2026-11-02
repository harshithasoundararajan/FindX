variable "aws_region" {
  description = "AWS region to deploy FindX infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project identifier used to prefix resource names"
  type        = string
  default     = "findx"
}

variable "vpc_cidr" {
  description = "CIDR block for the FindX VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet (EC2)"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets (RDS, multi-AZ)"
  type        = list(string)
  default     = ["10.0.2.0/24", "10.0.3.0/24"]
}

variable "ec2_instance_type" {
  description = "EC2 instance type hosting Docker Compose stack"
  type        = string
  default     = "t3.medium"
}

variable "ec2_key_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "findx"
}

variable "db_username" {
  description = "Master username for RDS PostgreSQL"
  type        = string
  default     = "findx_user"
}

variable "db_password" {
  description = "Master password for RDS PostgreSQL"
  type        = string
  sensitive   = true
}

variable "s3_bucket_name" {
  description = "Globally-unique S3 bucket name for item images"
  type        = string
  default     = "findx-item-images"
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to SSH into the EC2 instance"
  type        = string
  default     = "0.0.0.0/0"
}
