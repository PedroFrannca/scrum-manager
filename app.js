const express = require('express');
const app = express();
const tasksRoutes = require('./src/routes/tasksRoutes'); // Rotas de tasks


// Middleware para permitir JSON no corpo das requisições
app.use(express.json());

// Rotas
app.use('/api', tasksRoutes); // Prefixo '/api' para as rotas de tasks

// Middleware de tratamento de erros (opcional)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

module.exports = app;
