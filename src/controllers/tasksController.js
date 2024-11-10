const Task = require('../models/tasks'); // Supondo que o modelo está na pasta models

// Função para criar uma nova tarefa
exports.createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para listar todas as tarefas
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para obter uma tarefa por ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para atualizar uma tarefa por ID
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para deletar uma tarefa por ID
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
