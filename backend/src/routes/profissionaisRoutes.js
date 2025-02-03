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
        const { rows } = await pool.query('SELECT * FROM profissionais ORDER BY nome');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar profissionais:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome, especialidade, email, fone } = req.body;
        
        if (!nome || !especialidade || !email || !fone) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const { rows } = await pool.query(
            'INSERT INTO profissionais (nome, especialidade, email, fone) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, especialidade, email, fone]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao criar profissional:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, especialidade, email, fone } = req.body;
        
        if (!nome || !especialidade || !email || !fone) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const { rows } = await pool.query(
            'UPDATE profissionais SET nome = $1, especialidade = $2, email = $3, fone = $4 WHERE id = $5 RETURNING *',
            [nome, especialidade, email, fone, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Profissional não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar profissional:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM profissionais WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Profissional não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar profissional:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;