output "frontend_service_ip" {
  value = kubernetes_service.frontend.status[0].load_balancer_ingress[0].ip
  description = "IP do LoadBalancer do Frontend"
}

output "namespace" {
  value = kubernetes_namespace.chicsuite.metadata[0].name
  description = "Namespace do Kubernetes"
}

output "frontend_pods" {
  value = kubernetes_deployment.frontend.spec[0].replicas
  description = "Número de pods do frontend"
}

output "backend_pods" {
  value = kubernetes_deployment.backend.spec[0].replicas
  description = "Número de pods do backend"
}

output "postgres_connection" {
  value = "postgres://${kubernetes_service.postgres.metadata[0].name}:5432/chicsuite"
  description = "String de conexão do PostgreSQL (interna)"
}