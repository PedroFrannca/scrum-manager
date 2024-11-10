const express = require('express');
const router = express.Router();
const controllerTasks = require('../controllers/tasksController');

// Rota para criar uma nova tarefa
router.post('/tasks', controllerTasks.createTask);

// Rota para obter todas as tarefas
router.get('/tasks', controllerTasks.getAllTasks);

// Rota para obter uma tarefa específica por ID
router.get('/tasks/:id', controllerTasks.getTaskById);

// Rota para atualizar uma tarefa específica por ID
router.put('/tasks/:id', controllerTasks.updateTask);

// Rota para deletar uma tarefa específica por ID
router.delete('/tasks/:id', controllerTasks.deleteTask);

module.exports = router;
