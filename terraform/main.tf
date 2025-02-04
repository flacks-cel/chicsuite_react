resource "kubernetes_namespace" "chicsuite" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_secret" "postgres" {
  metadata {
    name      = "postgres-secret"
    namespace = kubernetes_namespace.chicsuite.metadata[0].name
  }

  data = {
    POSTGRES_PASSWORD = var.postgres_password
  }
}

# Frontend
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.chicsuite.metadata[0].name
  }

  spec {
    replicas = var.app_replicas

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          image = "chicsuite-frontend:latest"
          name  = "frontend"
          
          port {
            container_port = 3000
          }

          env {
            name  = "REACT_APP_API_URL"
            value = "http://backend:3000"
          }
        }
      }
    }
  }
}

# Backend
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.chicsuite.metadata[0].name
  }

  spec {
    replicas = var.app_replicas

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          image = "chicsuite-backend:latest"
          name  = "backend"
          
          port {
            container_port = 3000
          }

          env {
            name  = "DB_HOST"
            value = "postgres"
          }
          env {
            name  = "DB_PORT"
            value = "5432"
          }
          env {
            name  = "DB_USER"
            value = "postgres"
          }
          env {
            name = "DB_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.postgres.metadata[0].name
                key  = "POSTGRES_PASSWORD"
              }
            }
          }
          env {
            name  = "DB_NAME"
            value = "chicsuite"
          }
        }
      }
    }
  }
}

# Database
resource "kubernetes_stateful_set" "postgres" {
  metadata {
    name      = "postgres"
    namespace = kubernetes_namespace.chicsuite.metadata[0].name
  }

  spec {
    service_name = "postgres"
    replicas     = 1

    selector {
      match_labels = {
        app = "postgres"
      }
    }

    template {
      metadata {
        labels = {
          app = "postgres"
        }
      }

      spec {
        container {
          name  = "postgres"
          image = "postgres:15.5"

          port {
            container_port = 5432
          }

          env {
            name  = "POSTGRES_DB"
            value = "chicsuite"
          }
          env {
            name  = "POSTGRES_USER"
            value = "postgres"
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.postgres.metadata[0].name
                key  = "POSTGRES_PASSWORD"
              }
            }
          }

          volume_mount {
            name       = "postgres-storage"
            mount_path = "/var/lib/postgresql/data"
          }
        }
      }
    }

    volume_claim_template {
      metadata {
        name = "postgres-storage"
      }

      spec {
        access_modes = ["ReadWriteOnce"]
        resources {
          requests = {
            storage = "1Gi"
          }
        }
      }
    }
  }
}

# Services
resource "kubernetes_service" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.chicsuite.metadata[0].name
  }

  spec {
    selector = {
      app = "frontend"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "LoadBalancer"
  }
}

resource "kubernetes_service" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.chicsuite.metadata[0].name
  }

  spec {
    selector = {
      app = "backend"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_service" "postgres" {
  metadata {
    name      = "postgres"
    namespace = kubernetes_namespace.chicsuite.metadata[0].name
  }

  spec {
    selector = {
      app = "postgres"
    }

    port {
      port        = 5432
      target_port = 5432
    }

    type = "ClusterIP"
  }
}