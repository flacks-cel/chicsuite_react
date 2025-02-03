const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const clientesRoutes = require('./routes/clientesRoutes');
const produtosRoutes = require('./routes/produtosRoutes');
const profissionaisRoutes = require('./routes/profissionaisRoutes');
const promocoesRoutes = require('./routes/promocoesRoutes');
const atendimentosRoutes = require('./routes/atendimentosRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Body:`, req.body);
    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'API ChicSuite funcionando!' });
});

app.use('/clientes', clientesRoutes);
app.use('/produtos', produtosRoutes);
app.use('/profissionais', profissionaisRoutes);
app.use('/promocoes', promocoesRoutes);
app.use('/atendimentos', atendimentosRoutes);

app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({ 
        message: 'Erro interno do servidor!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});