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

// Rota para adicionar uma tarefa ao usuário
router.post('/users/:userId/add-task/:taskId', userController.addTaskToUser);

// Rota para remover uma tarefa do usuário
router.post('/users/:userId/remove-task/:taskId', userController.removeTaskFromUser);


module.exports = router;
