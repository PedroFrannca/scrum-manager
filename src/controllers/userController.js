const User = require('../models/user');
const Task = require('../models/tasks');

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, tasks } = req.body;

    const user = new User({
      name,
      email,
      password,
      tasks,
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
    const { name, email, password, tasks } = req.body;

    // Verificar se o email já existe para outro usuário
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'Este email já está em uso por outro usuário.' });
    }

    const user = await User.findByIdAndUpdate(userId, {
      name,
      email,
      password,
      tasks,
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
