const mongoose = require('mongoose');


// Esquema para o usuário
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  myTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',  // Refere-se ao modelo de task
  }],
});

// Modelo do usuário
const User = mongoose.model('User', userSchema);

module.exports = User;
