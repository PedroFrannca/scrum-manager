const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config();


const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log(`Conectado ao MongoDB (${process.env.NODE_ENV})`);
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error.message);
    });
