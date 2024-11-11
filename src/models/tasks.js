const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        default: 'backlog',
    },
    responsibles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Refere-se ao modelo de task
      }],
});

module.exports = mongoose.model('Task', taskSchema);
