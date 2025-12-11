output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.kanban_app.public_ip
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_instance.kanban_app.public_ip}:3000"
}

output "backend_url" {
  description = "URL to access the backend API"
  value       = "http://${aws_instance.kanban_app.public_ip}:5000"
}
