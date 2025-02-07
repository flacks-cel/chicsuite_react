const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  
  if (!bearerHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = bearerHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Aplicar middleware em todas as rotas
router.use(verifyToken);

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nome, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
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