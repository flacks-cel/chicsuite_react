const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nome, email, role FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

// Criar usuário
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;
    const result = await pool.query(
      'INSERT INTO users (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [nome, email, senha, role]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

module.exports = router;