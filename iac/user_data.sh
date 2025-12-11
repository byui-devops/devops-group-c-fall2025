#!/bin/bash
set -e

# Log everything to a file for debugging
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Starting user data script..."

# Update system
echo "Updating system packages..."
yum update -y

# Install Docker
echo "Installing Docker..."
yum install -y docker
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
usermod -a -G docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Install Git
echo "Installing Git..."
yum install -y git

# Create application directory
echo "Setting up application directory..."
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Clone the repository (assuming it's public)
echo "Cloning repository..."
git clone https://github.com/shawnjensen/devops-group-c-fall2025.git .

# Create .env file with secrets
echo "Creating .env file with environment variables..."
cat > .env << EOF
SUPABASE_URL=${supabase_url}
SUPABASE_KEY=${supabase_key}
PORT=${port}
EOF

# Set proper permissions
chown -R ec2-user:ec2-user /home/ec2-user/app
chmod 600 .env

# Pull Docker images
echo "Pulling Docker images..."
docker pull shawnjensen/devops-group-c-fall2025-frontend:latest
docker pull shawnjensen/devops-group-c-fall2025-backend:latest

# Start the application
echo "Starting application with docker-compose..."
docker-compose up -d

echo "User data script completed successfully!"
echo "Application should be running on ports 3000 (frontend) and 5000 (backend)"
