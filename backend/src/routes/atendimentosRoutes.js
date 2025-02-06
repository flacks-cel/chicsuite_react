const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { verifyToken, checkPermission } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const pool = new Pool({
    user: 'postgres',
    password: 'flacks0102',
    host: 'postgres',
    database: 'chicsuite',
    port: 5432
});

// Adiciona middleware de autenticação e auditoria para todas as rotas
router.use(verifyToken);
router.use(auditLog);

// GET - Listar atendimentos
router.get('/', 
    checkPermission('read:appointment'),
    async (req, res) => {
        try {
            let query = 'SELECT * FROM atendimentos';
            const params = [];

            // Se não for admin, filtra apenas os atendimentos relevantes
            if (req.user.role !== 'admin') {
                if (req.user.role === 'professional') {
                    query += ' WHERE profissional_id = $1';
                    params.push(req.user.id);
                } else if (req.user.role === 'attendant') {
                    query += ' WHERE data_criacao >= CURRENT_DATE';
                }
            }

            const { rows } = await pool.query(query, params);
            res.json(rows);
        } catch (error) {
            console.error('Erro ao listar atendimentos:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// POST - Criar atendimento
router.post('/', 
    checkPermission('create:appointment'),
    async (req, res) => {
        try {
            console.log('Recebido:', req.body);
            const { cliente_id, profissional_id, servico, preco } = req.body;
            
            // Registra quem criou o atendimento
            const { rows } = await pool.query(
                `INSERT INTO atendimentos 
                    (cliente_id, profissional_id, servico, preco, criado_por) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *`,
                [cliente_id, profissional_id, servico, preco, req.user.id]
            );

            // Registra a criação no log de auditoria
            await pool.query(
                `INSERT INTO audit_logs 
                    (user_id, action, resource, details) 
                VALUES ($1, $2, $3, $4)`,
                [
                    req.user.id,
                    'CREATE',
                    'atendimentos',
                    JSON.stringify({
                        atendimento_id: rows[0].id,
                        cliente_id,
                        profissional_id,
                        servico,
                        preco
                    })
                ]
            );

            res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Erro ao criar atendimento:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// PUT - Atualizar atendimento
router.put('/:id',
    checkPermission('update:appointment'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { cliente_id, profissional_id, servico, preco } = req.body;

            // Verifica se o atendimento existe e se o usuário tem permissão
            const atendimentoAtual = await pool.query(
                'SELECT * FROM atendimentos WHERE id = $1',
                [id]
            );

            if (atendimentoAtual.rows.length === 0) {
                return res.status(404).json({ message: 'Atendimento não encontrado' });
            }

            // Apenas admin pode editar atendimentos antigos
            if (req.user.role !== 'admin') {
                const atendimentoData = new Date(atendimentoAtual.rows[0].data_criacao);
                const hoje = new Date();
                if (atendimentoData.toDateString() !== hoje.toDateString()) {
                    return res.status(403).json({ 
                        message: 'Não é possível editar atendimentos de dias anteriores' 
                    });
                }
            }

            const { rows } = await pool.query(
                `UPDATE atendimentos 
                SET cliente_id = $1, 
                    profissional_id = $2, 
                    servico = $3, 
                    preco = $4,
                    atualizado_por = $5,
                    data_atualizacao = CURRENT_TIMESTAMP
                WHERE id = $6 
                RETURNING *`,
                [cliente_id, profissional_id, servico, preco, req.user.id, id]
            );

            // Registra a atualização no log de auditoria
            await pool.query(
                `INSERT INTO audit_logs 
                    (user_id, action, resource, details) 
                VALUES ($1, $2, $3, $4)`,
                [
                    req.user.id,
                    'UPDATE',
                    'atendimentos',
                    JSON.stringify({
                        atendimento_id: id,
                        alteracoes: req.body,
                        valor_anterior: atendimentoAtual.rows[0]
                    })
                ]
            );

            res.json(rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar atendimento:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// DELETE - Remover atendimento (apenas admin)
router.delete('/:id',
    checkPermission('delete:appointment'),
    async (req, res) => {
        try {
            const { id } = req.params;

            // Apenas admin pode deletar
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    message: 'Apenas administradores podem excluir atendimentos' 
                });
            }

            // Registra o atendimento antes de deletar
            const atendimentoAtual = await pool.query(
                'SELECT * FROM atendimentos WHERE id = $1',
                [id]
            );

            if (atendimentoAtual.rows.length === 0) {
                return res.status(404).json({ message: 'Atendimento não encontrado' });
            }

            // Soft delete - apenas marca como deletado
            const { rows } = await pool.query(
                `UPDATE atendimentos 
                SET deletado = true,
                    deletado_por = $1,
                    data_delecao = CURRENT_TIMESTAMP
                WHERE id = $2 
                RETURNING *`,
                [req.user.id, id]
            );

            // Registra a deleção no log de auditoria
            await pool.query(
                `INSERT INTO audit_logs 
                    (user_id, action, resource, details) 
                VALUES ($1, $2, $3, $4)`,
                [
                    req.user.id,
                    'DELETE',
                    'atendimentos',
                    JSON.stringify({
                        atendimento_id: id,
                        dados_atendimento: atendimentoAtual.rows[0]
                    })
                ]
            );

            res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar atendimento:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;