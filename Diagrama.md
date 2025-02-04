## DIAGRAMA DO SISTEMA **ChicSuite**:

```mermaid
graph TD
    A[Frontend - React] -->|HTTP Requests| B[Backend - Node.js + Express]
    B -->|SQL Queries| C[Banco de Dados - PostgreSQL]
    C -->|Query Results| B
    B -->|API Responses| A

    subgraph Infraestrutura
        D[Docker Compose / Kubernetes] -->|Gerencia| A
        D -->|Gerencia| B
        D -->|Gerencia| C
        E[Terraform] -->|Provisiona| D
    end

    subgraph Banco de Dados
        C --> T1[Tabela: clientes]
        C --> T2[Tabela: profissionais]
        C --> T3[Tabela: produtos]
        C --> T4[Tabela: promoções]
        C --> T5[Tabela: atendimentos]
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#fbb,stroke:#333,stroke-width:2px
    style D fill:#bfb,stroke:#333,stroke-width:2px
    style E fill:#ffb,stroke:#333,stroke-width:2px
    style T1 fill:#fbb,stroke:#333,stroke-width:1px
    style T2 fill:#fbb,stroke:#333,stroke-width:1px
    style T3 fill:#fbb,stroke:#333,stroke-width:1px
    style T4 fill:#fbb,stroke:#333,stroke-width:1px
    style T5 fill:#fbb,stroke:#333,stroke-width:1px