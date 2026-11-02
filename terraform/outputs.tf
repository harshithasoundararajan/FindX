output "ec2_public_ip" {
  description = "Public IP address of the FindX EC2 instance"
  value       = aws_instance.findx_app_server.public_ip
}

output "rds_endpoint" {
  description = "Connection endpoint for the FindX PostgreSQL RDS instance"
  value       = aws_db_instance.findx_postgres.endpoint
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket storing item images"
  value       = aws_s3_bucket.item_images.bucket
}

output "vpc_id" {
  description = "ID of the FindX VPC"
  value       = aws_vpc.findx_vpc.id
}
