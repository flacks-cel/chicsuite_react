variable "namespace" {
  description = "Kubernetes namespace"
  default     = "chicsuite"
}

variable "postgres_password" {
  description = "PostgreSQL password"
  default     = "flacks0102"
}

variable "app_replicas" {
  description = "Number of app replicas"
  default     = 1
}