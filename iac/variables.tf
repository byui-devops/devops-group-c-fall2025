variable "supabase_url" {
  description = "Supabase URL for the application"
  type        = string
  sensitive   = true
}

variable "supabase_key" {
  description = "Supabase API key for the application"
  type        = string
  sensitive   = true
}

variable "port" {
  description = "Port for the application"
  type        = string
  default     = "5000"
}
