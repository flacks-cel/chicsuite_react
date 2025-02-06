const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 host: process.env.DB_HOST,
 database: process.env.DB_NAME,
 port: parseInt(process.env.DB_PORT),
});

router.post('/login', async (req, res) => {
 try {
   const { email, senha } = req.body;
   
   const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 AND senha = $2', [email, senha]);

   if (rows.length === 0) {
     return res.status(401).json({ message: 'Credenciais inválidas' });
   }

   const token = jwt.sign(
     { 
       id: rows[0].id, 
       role: rows[0].role,
       email: rows[0].email
     },
     process.env.JWT_SECRET,
     { expiresIn: '8h' }
   );

   return res.json({ token });
   
 } catch (error) {
   console.error('Erro:', error);
   res.status(500).json({ message: 'Erro interno' });
 }
});

module.exports = router;