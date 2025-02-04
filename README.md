> **ChicSuite - Sistema de Gestão para Salão de Beleza**  
> **© 2024-2025 Flávio Lacks**  
>  
> Todos os direitos reservados. Este software não pode ser copiado, modificado, distribuído ou usado sem permissão expressa do autor.

# ChicSuite - Sistema de Gestão para Salão de Beleza

## Arquitetura do Sistema

O ChicSuite é dividido em três componentes principais:
- Frontend (React)
- Backend (Node.js/Express)
- Banco de dados (PostgreSQL)

## Estrutura Kubernetes

O sistema está organizado em diferentes recursos do Kubernetes:

### Database (PostgreSQL)
- StatefulSet para garantir persistência dos dados
- ConfigMap com configurações do banco
- Secret para senhas e dados sensíveis
- PersistentVolume para armazenamento
- Service para comunicação interna

### Backend
- Deployment para gerenciar os pods
- Service para expor a API
- Configuração de ambiente via ConfigMap
- Conexão com o banco via variáveis de ambiente

### Frontend
- Deployment para gerenciar a interface
- Service do tipo LoadBalancer para acesso externo
- Configuração de ambiente para conectar com o backend

### Ingress
- Gerencia o tráfego externo
- Roteia requisições para os serviços apropriados
- Configura SSL/TLS (se necessário)

## Como Executar

1. Pré-requisitos:
   - Kubernetes cluster configurado (minikube para desenvolvimento)
   - kubectl instalado
   - Docker instalado

2. Iniciar o cluster:
```bash
minikube start
```

3. Habilitar o Ingress:
```bash
minikube addons enable ingress
```

4. Construir as imagens:
```bash
eval $(minikube docker-env)
docker-compose build
```

5. Aplicar as configurações Kubernetes:
```bash
kubectl apply -f k8s/database/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress.yaml
```

6. Verificar o status:
```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

7. Acessar o sistema:
```bash
# Obter o IP do minikube
minikube ip

# Adicionar ao /etc/hosts:
# [minikube-ip] chicsuite.local
```

O sistema estará disponível em: http://chicsuite.local

## Monitoramento e Logs

- Ver logs do backend:
```bash
kubectl logs -f deployment/backend
```

- Ver logs do frontend:
```bash
kubectl logs -f deployment/frontend
```

- Ver logs do banco:
```bash
kubectl logs -f statefulset/postgres
```

## Escalabilidade

O sistema pode ser escalado horizontalmente:
```bash
# Escalar backend para 3 réplicas
kubectl scale deployment backend --replicas=3

# Escalar frontend para 2 réplicas
kubectl scale deployment frontend --replicas=2
```

## Manutenção

- Atualizar imagens:
```bash
kubectl set image deployment/backend backend=chicsuite-backend:nova-versao
kubectl set image deployment/frontend frontend=chicsuite-frontend:nova-versao
```

- Reiniciar deployments:
```bash
kubectl rollout restart deployment backend
kubectl rollout restart deployment frontend
```

## Backup do Banco de Dados

```bash
# Executar backup
kubectl exec -it postgres-0 -- pg_dump -U postgres chicsuite > backup.sql

# Restaurar backup
kubectl exec -it postgres-0 -- psql -U postgres chicsuite < backup.sql
```

## Troubleshooting

1. Verificar status dos pods:
```bash
kubectl get pods
```

2. Descrever um pod com problema:
```bash
kubectl describe pod [nome-do-pod]
```

3. Ver logs detalhados:
```bash
kubectl logs [nome-do-pod] --previous
```

4. Verificar conectividade:
```bash
kubectl exec -it [nome-do-pod] -- curl backend-service:3000
```

### PASSO A PASSO

1. Clone o repositório:
   ```bash
   git clone https://github.com/flacks-cel/chicsuite_react.git
   cd chicsuite