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

// GET
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM clientes ORDER BY nome');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const { nome, email, fone } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO clientes (nome, email, fone) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, fone]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, fone } = req.body;
        const { rows } = await pool.query(
            'UPDATE clientes SET nome = $1, email = $2, fone = $3 WHERE id = $4 RETURNING *',
            [nome, email, fone, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;