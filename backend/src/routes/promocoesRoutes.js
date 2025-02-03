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

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM promocoes ORDER BY data_inicio DESC');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar promoções:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { titulo, descricao, data_inicio, data_fim } = req.body;
        
        if (!titulo || !data_inicio || !data_fim) {
            return res.status(400).json({ error: 'Título, data de início e data de fim são obrigatórios' });
        }

        const { rows } = await pool.query(
            'INSERT INTO promocoes (titulo, descricao, data_inicio, data_fim) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, descricao, data_inicio, data_fim]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao criar promoção:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, data_inicio, data_fim } = req.body;
        
        if (!titulo || !data_inicio || !data_fim) {
            return res.status(400).json({ error: 'Título, data de início e data de fim são obrigatórios' });
        }

        const { rows } = await pool.query(
            'UPDATE promocoes SET titulo = $1, descricao = $2, data_inicio = $3, data_fim = $4 WHERE id = $5 RETURNING *',
            [titulo, descricao, data_inicio, data_fim, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Promoção não encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar promoção:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM promocoes WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Promoção não encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar promoção:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;