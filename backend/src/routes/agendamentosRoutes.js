const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'flacks0102',
    host: 'postgres',
    database: 'chicsuite',
    port: 5432
});

// GET - Listar agendamentos
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM atendimentos 
            ORDER BY data_hora DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar agendamento
router.post('/', async (req, res) => {
    try {
        const {
            cliente_id,
            profissional_id,
            data_hora,
            produtos,
            promocao_id,
            desconto_adicional,
            valor_total
        } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO atendimentos 
            (cliente_id, profissional_id, data_hora, produtos, promocao_id, valor_total) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [cliente_id, profissional_id, data_hora, produtos, promocao_id, valor_total]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar agendamento
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            cliente_id,
            profissional_id,
            data_hora,
            produtos,
            promocao_id,
            desconto_adicional,
            valor_total
        } = req.body;

        const { rows } = await pool.query(
            `UPDATE atendimentos 
            SET cliente_id = $1, profissional_id = $2, data_hora = $3, 
                produtos = $4, promocao_id = $5, valor_total = $6
            WHERE id = $7 
            RETURNING *`,
            [cliente_id, profissional_id, data_hora, produtos, promocao_id, valor_total, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Remover agendamento
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM atendimentos WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;