#!/bin/bash
set -e

# Log everything to a file for debugging
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Starting user data script..."

# Update system
echo "Updating system packages..."
apt-get update -y

# Install Docker
echo "Installing Docker..."
apt-get install -y docker.io
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -a -G docker ubuntu

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
apt-get install -y git

# Create application directory
echo "Setting up application directory..."
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# Clone the repository (assuming it's public)
echo "Cloning repository..."
git clone https://github.com/byui-devops/devops-group-c-fall2025.git .

# Create .env file with secrets
echo "Creating .env file with environment variables..."
cat > .env << EOF
SUPABASE_URL=${supabase_url}
SUPABASE_KEY=${supabase_key}
PORT=${port}
EOF

# Create nginx configuration file
echo "Creating nginx configuration..."
cat > nginx.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    # Serve frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://backend:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX_EOF

# Set proper permissions
chown -R ubuntu:ubuntu /home/ubuntu/app
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
