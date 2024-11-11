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

// Função para adicionar um usuário aos responsibles de uma task
exports.addResponsible = async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;
  
    try {
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task não encontrada' });
      }
  
      // Verifica se o usuário já é responsável
      if (!task.responsibles.includes(userId)) {
        task.responsibles.push(userId);
        await task.save();
        return res.status(200).json(task);
      } else {
        return res.status(400).json({ message: 'Usuário já é responsável por esta tarefa' });
      }
    } catch (error) {
      res.status(500).json({ message: `Erro ao adicionar responsável: ${error.message}` });
    }
  };
  
  // Função para remover um usuário dos responsibles de uma task
  exports.removeResponsible = async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;
  
    try {
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task não encontrada' });
      }
  
      // Remove o usuário se ele estiver na lista de responsáveis
      task.responsibles = task.responsibles.filter(id => id.toString() !== userId.toString());
      await task.save();
  
      return res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: `Erro ao remover responsável: ${error.message}` });
    }
  };