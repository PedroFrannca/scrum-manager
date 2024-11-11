const User = require('../models/user');
const Task = require('../models/tasks');

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { name, myTasks } = req.body;

    const user = new User({
      name,
      myTasks,
    });

    await user.save();
    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar o usuário', error: err.message });
  }
};

// Listar todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('tasks');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar os usuários', error: err.message });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, myTasks } = req.body;

    // Verificar se o email já existe para outro usuário
    const existingUser = await User.findOne({ name });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'Este username já está em uso por outro usuário.' });
    }

    const user = await User.findByIdAndUpdate(userId, {
      name,
      myTasks,
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar o usuário', error: err.message });
  }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar o usuário', error: err.message });
  }
};

// Função para adicionar uma tarefa ao usuário
exports.addTaskToUser = async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a tarefa já está na lista myTasks do usuário
    if (!user.myTasks.includes(taskId)) {
      user.myTasks.push(taskId);
      await user.save();
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: 'Tarefa já associada ao usuário' });
    }
  } catch (error) {
    res.status(500).json({ message: `Erro ao adicionar tarefa: ${error.message}` });
  }
};

// Função para remover uma tarefa do usuário
exports.removeTaskFromUser = async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Remove a tarefa do array myTasks do usuário
    user.myTasks = user.myTasks.filter(id => id.toString() !== taskId);
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: `Erro ao remover tarefa: ${error.message}` });
  }
};
