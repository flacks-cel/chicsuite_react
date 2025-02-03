## Arquitetura do Sistema **ChicSuite**:


+----------------------------------------------------------------------------------------+
|                                                                                        |
|                                   **Sistema ChicSuite**                                |
|                                                                                        |
|   +-------------------+       +-------------------+       +-------------------+        |
|   |                   |       |                   |       |                   |        |
|   |    Frontend       |       |    Backend        |       |    Banco de Dados |        |
|   |   (React)         |       |   (Node.js +      |       |   (PostgreSQL)    |        |
|   |                   |       |    Express)       |       |                   |        |
|   |                   |       |                   |       |                   |        |
|   |   Interface do    |<----->|   API RESTful     |<----->|   Tabelas:        |        |
|   |   Usuário         | HTTP  |   (Rotas GET,     |  SQL  |   - clientes      |        |
|   |                   |       |    POST, PUT,     |       |   - profissionais |        |
|   |   Acessível em:   |       |    DELETE)        |       |   - produtos      |        |
|   |   localhost:3000  |       |   Roda em:        |       |   - promoções     |        |
|   |                   |       |   localhost:3000  |       |   - atendimentos  |        |
|   +-------------------+       +-------------------+       +-------------------+        |
|           ^                           ^                           ^                    |
|           |                           |                           |                    |
|           |                           |                           |                    |
|   +-------v---------------------------v---------------------------v-------+            |
|   |                                                                       |            |
|   |                         Docker Compose / Kubernetes                   |            |
|   |                                                                       |            |
|   |   - Gerencia os containers do Frontend, Backend e Banco de Dados.     |            |
|   |   - Garante que os serviços estejam sempre disponíveis.               |            |
|   |                                                                       |            |
|   +-----------------------------------------------------------------------+            |
|                                                                                        |
|                                                                                        |
|   +-------------------+       +-------------------+       +-------------------+        |
|   |                   |       |                   |       |                   |        |
|   |    Terraform      |       |    Kubernetes     |       |      Docker       |        |
|   | (Infraestrutura)  |       |   (Orquestração)  |       |   (Containers)    |        |
|   |                   |       |                   |       |                   |        |
|   |   - Provisiona    |       |   - Gerencia      |       |   - Isola e       |        |
|   |     recursos na   |       |     containers    |       |     executa os    |        |
|   |     nuvem.        |       |     em cluster.   |       |     serviços.     |        |
|   |                   |       |                   |       |                   |        |
|   +-------------------+       +-------------------+       +-------------------+        |
|                                                                                        |
+----------------------------------------------------------------------------------------+

### Explicação

- **Frontend**: Interface do usuário desenvolvida em React.
- **Backend**: API RESTful desenvolvida em Node.js e Express.
- **Banco de Dados**: PostgreSQL para armazenamento de dados.
- **Docker Compose / Kubernetes**: Gerencia a infraestrutura e orquestra os containers.
- **Terraform**: Automatiza a criação de infraestrutura na nuvem.

**Descrição da Arquitetura**

O sistema **ChicSuite** é composto por três componentes principais:

**FRONTEND**

Desenvolvido em React.

Responsável pela interface do usuário.

Comunica-se com o backend via Axios para buscar e enviar dados.

Roda na porta 3000 (ou 3001, dependendo da configuração do Docker).

**BACKEND**

Desenvolvido em Node.js com Express.

Expõe uma API RESTful para o frontend.

Conecta-se ao banco de dados PostgreSQL para persistir dados.

Roda na porta 3000.

**Banco de Dados**

Banco de Dados PostgreSQL:

Armazena dados de clientes, profissionais, produtos, promoções e atendimentos.

Roda na porta 5432.

Esse sistema é containerizado usando Docker e Docker Compose, e pode ser implantado em um ambiente de produção usando Kubernetes e Terraform.

**Fluxo de Comunicação**

O Frontend faz requisições HTTP (GET, POST, PUT, DELETE) para o Backend.

O Backend processa as requisições, interage com o Banco de Dados e retorna os dados ao Frontend.

O Banco de Dados armazena os dados e responde às consultas do Backend.

### Passo a Passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/flacks-cel/chicsuite_react.git
   cd chicsuite