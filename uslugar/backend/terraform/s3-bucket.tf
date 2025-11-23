# Terraform configuration za S3 bucket za PDF fakture
# Usage: terraform init && terraform apply

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "bucket_name" {
  description = "Ime S3 bucket-a za fakture"
  type        = string
  default     = "uslugar-invoices"
}

variable "region" {
  description = "AWS regija"
  type        = string
  default     = "eu-north-1"
}

provider "aws" {
  region = var.region
}

# S3 bucket za fakture
resource "aws_s3_bucket" "invoices" {
  bucket = var.bucket_name

  tags = {
    Name        = "Uslugar Invoices"
    Environment = "production"
    Purpose     = "PDF Invoice Storage"
  }
}

# Bucket versioning (za backup)
resource "aws_s3_bucket_versioning" "invoices" {
  bucket = aws_s3_bucket.invoices.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "invoices" {
  bucket = aws_s3_bucket.invoices.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Bucket policy (private - samo preko presigned URLs)
resource "aws_s3_bucket_policy" "invoices" {
  bucket = aws_s3_bucket.invoices.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DenyPublicAccess"
        Effect = "Deny"
        Principal = "*"
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.invoices.arn}/*"
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}

# Lifecycle policy
resource "aws_s3_bucket_lifecycle_configuration" "invoices" {
  bucket = aws_s3_bucket.invoices.id

  rule {
    id     = "MoveOldInvoicesToGlacier"
    status = "Enabled"
    prefix = "invoices/"

    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }

  rule {
    id     = "DeleteVeryOldInvoices"
    status = "Enabled"
    prefix = "invoices/"

    expiration {
      days = 2555  # 7 godina (pravni zahtjev)
    }
  }
}

# CORS policy (ako je potrebno)
resource "aws_s3_bucket_cors_configuration" "invoices" {
  bucket = aws_s3_bucket.invoices.id

  cors_rule {
    allowed_origins = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_headers = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Outputs
output "bucket_name" {
  description = "Ime S3 bucket-a"
  value       = aws_s3_bucket.invoices.id
}

output "bucket_arn" {
  description = "ARN S3 bucket-a"
  value       = aws_s3_bucket.invoices.arn
}

