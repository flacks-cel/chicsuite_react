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

// GET - Listar atendimentos
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM atendimentos');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar atendimentos:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar atendimento
router.post('/', async (req, res) => {
    try {
        console.log('Recebido:', req.body);
        const { cliente_id, profissional_id, servico, preco } = req.body;
        
        const { rows } = await pool.query(
            'INSERT INTO atendimentos (cliente_id, profissional_id, servico, preco) VALUES ($1, $2, $3, $4) RETURNING *',
            [cliente_id, profissional_id, servico, preco]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao criar atendimento:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;