terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

# Security Group - Allow HTTP traffic and SSH
resource "aws_security_group" "kanban_sg" {
  name        = "kanban-app-security-group"
  description = "Security group for Kanban application"

  # Allow HTTP traffic (port 80)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP traffic"
  }

  # Allow application port (3000 for frontend)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow frontend traffic"
  }

  # Allow backend port (5000)
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow backend traffic"
  }

  # Allow SSH (for AWS console remote connection)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow SSH"
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "kanban-app-sg"
  }
}

# EC2 Instance
resource "aws_instance" "kanban_app" {
  ami           = "ami-05134c8ef96964280"  # Ubuntu 22.04 LTS in us-west-2
  instance_type = "t2.micro"

  vpc_security_group_ids = [aws_security_group.kanban_sg.id]

  user_data = templatefile("${path.module}/user_data.sh", {
    supabase_url = var.supabase_url
    supabase_key = var.supabase_key
    port         = var.port
  })

  tags = {
    Name = "kanban-application"
  }

  # Ensure the instance is replaced if user_data changes
  user_data_replace_on_change = true
}
