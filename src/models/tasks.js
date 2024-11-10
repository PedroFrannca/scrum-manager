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
        enum: ['backlog', 'in progress', 'done'],
        default: 'backlog',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint',
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
    },
    dueDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

// Middleware para atualizar o campo updatedAt
taskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Task', taskSchema);
