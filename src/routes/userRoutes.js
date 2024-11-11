const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Criar um novo usuário
router.post('/users', userController.createUser);

// Listar todos os usuários
router.get('/users', userController.getUsers);

// Atualizar um usuário
router.put('/users/:userId', userController.updateUser);

// Deletar um usuário
router.delete('/users/:userId', userController.deleteUser);

module.exports = router;
