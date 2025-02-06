const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 host: process.env.DB_HOST, 
 database: process.env.DB_NAME,
 port: parseInt(process.env.DB_PORT)
});

// Criar usuário
router.post('/', async (req, res) => {
 try {
   const { nome, email, senha, role } = req.body;
   const senhaHash = bcrypt.hashSync(senha, 10);
   
   const result = await pool.query(
     'INSERT INTO users (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING id',
     [nome, email, senhaHash, role]
   );
   
   res.status(201).json({ id: result.rows[0].id });
 } catch (error) {
   res.status(500).json({ message: 'Erro ao criar usuário' });
 }
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

// Atualizar usuário
router.put('/:id', async (req, res) => {
 try {
   const { nome, email, senha, role } = req.body;
   const { id } = req.params;
   
   if (senha) {
     const senhaHash = bcrypt.hashSync(senha, 10);
     await pool.query(
       'UPDATE users SET nome = $1, email = $2, senha = $3, role = $4 WHERE id = $5',
       [nome, email, senhaHash, role, id]
     );
   } else {
     await pool.query(
       'UPDATE users SET nome = $1, email = $2, role = $3 WHERE id = $4',
       [nome, email, role, id]
     );
   }
   
   res.json({ message: 'Usuário atualizado' });
 } catch (error) {
   res.status(500).json({ message: 'Erro ao atualizar usuário' });
 }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
 try {
   await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
   res.json({ message: 'Usuário deletado' });
 } catch (error) {
   res.status(500).json({ message: 'Erro ao deletar usuário' });
 }
});

module.exports = router;