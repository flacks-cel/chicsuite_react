CREATE TABLE IF NOT EXISTS clientes (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   fone VARCHAR(20) NOT NULL,
   data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profissionais (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   especialidade VARCHAR(50) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   fone VARCHAR(20) NOT NULL,
   data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   descricao TEXT,
   estoque INTEGER NOT NULL DEFAULT 0,
   preco DECIMAL(10,2) NOT NULL,
   data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promocoes (
   id SERIAL PRIMARY KEY,
   titulo VARCHAR(100) NOT NULL,
   descricao TEXT,
   data_inicio DATE NOT NULL,
   data_fim DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS atendimentos (
   id SERIAL PRIMARY KEY,
   cliente_id INTEGER REFERENCES clientes(id),
   profissional_id INTEGER REFERENCES profissionais(id),
   promocao_id INTEGER REFERENCES promocoes(id),
   servico VARCHAR(100) NOT NULL,
   forma_pagamento VARCHAR(20) CHECK (forma_pagamento IN ('dinheiro', 'debito', 'credito', 'pix')),
   status_pagamento VARCHAR(20) DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago', 'cancelado')),
   preco DECIMAL(10,2) NOT NULL,
   data_atendimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para múltiplos produtos por atendimento
CREATE TABLE IF NOT EXISTS atendimento_produtos (
   id SERIAL PRIMARY KEY,
   atendimento_id INTEGER REFERENCES atendimentos(id),
   produto_id INTEGER REFERENCES produtos(id),
   quantidade INTEGER NOT NULL DEFAULT 1,
   preco_unitario DECIMAL(10,2) NOT NULL,
   UNIQUE(atendimento_id, produto_id)
);

CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   senha VARCHAR(255) NOT NULL,
   role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'attendant', 'professional')),
   data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs de auditoria
CREATE TABLE audit_logs (
   id SERIAL PRIMARY KEY,
   user_id INTEGER REFERENCES users(id),
   action VARCHAR(10) NOT NULL,
   resource VARCHAR(255) NOT NULL,
   details JSONB,
   status_code INTEGER,
   duration INTEGER,
   ip_address VARCHAR(45),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sessões de usuário
CREATE TABLE user_sessions (
   id SERIAL PRIMARY KEY,
   user_id INTEGER REFERENCES users(id),
   token VARCHAR(500) NOT NULL,
   ip_address VARCHAR(45),
   user_agent TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   expires_at TIMESTAMP NOT NULL
);

-- Índices para melhor performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_atendimento_produtos_atendimento ON atendimento_produtos(atendimento_id);
CREATE INDEX idx_atendimento_produtos_produto ON atendimento_produtos(produto_id);

-- Criar usuário admin inicial
INSERT INTO users (nome, email, senha, role) 
VALUES ('Admin', 'admin@chicsuite.com', '$2b$10$kKEiHuqfwFNJgDfJHmsRkOnPt83fNFykW8srAsZ6lYcdPi4GcdGW6', 'admin');