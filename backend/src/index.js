const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const clientesRoutes = require('./routes/clientesRoutes');
const produtosRoutes = require('./routes/produtosRoutes');
const profissionaisRoutes = require('./routes/profissionaisRoutes');
const promocoesRoutes = require('./routes/promocoesRoutes');
const agendamentosRoutes = require('./routes/agendamentosRoutes');
const authRoutes = require('./routes/authRoutes');

// Inicializa o app
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Body:`, req.body);
    next();
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({ message: 'API ChicSuite funcionando!' });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/promocoes', promocoesRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({ 
        message: 'Erro interno do servidor!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});