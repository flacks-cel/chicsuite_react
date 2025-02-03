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

// GET - Listar produtos
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM produtos ORDER BY nome');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar produto
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, estoque, preco } = req.body;
        if (!nome || !preco || estoque === undefined) {
            return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
        }

        const { rows } = await pool.query(
            'INSERT INTO produtos (nome, descricao, estoque, preco) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, descricao, estoque, preco]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar produto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, estoque, preco } = req.body;
        
        if (!nome || !preco || estoque === undefined) {
            return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
        }

        const { rows } = await pool.query(
            'UPDATE produtos SET nome = $1, descricao = $2, estoque = $3, preco = $4 WHERE id = $5 RETURNING *',
            [nome, descricao, estoque, preco, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Remover produto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;