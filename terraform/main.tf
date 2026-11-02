terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_availability_zones" "available" {
  state = "available"
}

# ---------------- Networking ----------------

resource "aws_vpc" "findx_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "${var.project_name}-vpc" }
}

resource "aws_internet_gateway" "findx_igw" {
  vpc_id = aws_vpc.findx_vpc.id
  tags   = { Name = "${var.project_name}-igw" }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.findx_vpc.id
  cidr_block               = var.public_subnet_cidr
  map_public_ip_on_launch  = true
  availability_zone        = data.aws_availability_zones.available.names[0]
  tags = { Name = "${var.project_name}-public-subnet" }
}

resource "aws_subnet" "private_subnets" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.findx_vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = { Name = "${var.project_name}-private-subnet-${count.index}" }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.findx_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.findx_igw.id
  }
  tags = { Name = "${var.project_name}-public-rt" }
}

resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# ---------------- Security Groups ----------------

resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Allow HTTP, HTTPS, SSH, and app port to the FindX EC2 instance"
  vpc_id      = aws_vpc.findx_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "${var.project_name}-ec2-sg" }
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow PostgreSQL access only from the FindX EC2 instance"
  vpc_id      = aws_vpc.findx_vpc.id

  ingress {
    description     = "PostgreSQL from EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "${var.project_name}-rds-sg" }
}

# ---------------- IAM (EC2 -> S3) ----------------

resource "aws_iam_role" "ec2_s3_role" {
  name = "${var.project_name}-ec2-s3-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "ec2_s3_policy" {
  name = "${var.project_name}-ec2-s3-policy"
  role = aws_iam_role.ec2_s3_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"]
      Resource = [
        aws_s3_bucket.item_images.arn,
        "${aws_s3_bucket.item_images.arn}/*"
      ]
    }]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-instance-profile"
  role = aws_iam_role.ec2_s3_role.name
}

# ---------------- S3 ----------------

resource "aws_s3_bucket" "item_images" {
  bucket = var.s3_bucket_name
  tags   = { Name = "${var.project_name}-item-images" }
}

resource "aws_s3_bucket_public_access_block" "item_images_block" {
  bucket                  = aws_s3_bucket.item_images.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "item_images_cors" {
  bucket = aws_s3_bucket.item_images.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# ---------------- RDS ----------------

resource "aws_db_subnet_group" "findx_db_subnet_group" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private_subnets[*].id
  tags       = { Name = "${var.project_name}-db-subnet-group" }
}

resource "aws_db_instance" "findx_postgres" {
  identifier             = "${var.project_name}-postgres"
  engine                 = "postgres"
  engine_version         = "16.3"
  instance_class         = var.db_instance_class
  allocated_storage      = 20
  storage_type           = "gp3"
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.findx_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = false
  multi_az               = false
  tags = { Name = "${var.project_name}-postgres" }
}

# ---------------- EC2 ----------------

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "findx_app_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = var.ec2_key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    mkdir -p /opt/findx
  EOF

  tags = { Name = "${var.project_name}-app-server" }
}
