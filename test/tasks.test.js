const request = require('supertest');
const app = require('../app'); // Seu arquivo principal do servidor
const Task = require('../src/models/tasks'); // Modelo de Task
const mongoose = require('mongoose');

describe('Testes de rotas de tarefas', () => {
    beforeAll(async () => {
        // Conecta ao banco de dados antes de executar os testes
        await mongoose.connect('mongodb://localhost:27018/scrum-manager-test');
    });

    afterAll(async () => {
        // Limpa a base de dados de testes após os testes
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    // Teste de criação de uma tarefa
    it('deve criar uma nova tarefa', async () => {
        const newTask = {
            title: 'Nova Tarefa',
            description: 'Descrição da nova tarefa',
            status: 'backlog',
            priority: 'medium',
            project: new mongoose.Types.ObjectId(), // Substitua com um ObjectId válido se necessário
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(newTask)
            .expect(201); // Espera status 201 de criação

        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.description).toBe(newTask.description);
        expect(response.body.status).toBe(newTask.status);
        expect(response.body.priority).toBe(newTask.priority);
    });

    // Teste de obtenção de todas as tarefas
    it('deve retornar todas as tarefas', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .expect(200); // Espera status 200 de sucesso

        expect(Array.isArray(response.body)).toBe(true);
    });

    // Teste de obtenção de uma tarefa pelo ID
    it('deve retornar uma tarefa por ID', async () => {
        const task = await Task.create({
            title: 'Tarefa Existente',
            description: 'Descrição de uma tarefa existente',
            project: new mongoose.Types.ObjectId(), // Substitua com um ObjectId válido se necessário
        });

        const response = await request(app)
            .get(`/api/tasks/${task._id}`)
            .expect(200); // Espera status 200 de sucesso

        expect(response.body._id).toBe(task._id.toString());
        expect(response.body.title).toBe(task.title);
    });

    // Teste de atualização de uma tarefa
    it('deve atualizar uma tarefa', async () => {
        const task = await Task.create({
            title: 'Tarefa a ser atualizada',
            description: 'Descrição para atualização',
            project: new mongoose.Types.ObjectId(), // Substitua com um ObjectId válido se necessário
        });

        const updatedTask = {
            title: 'Tarefa Atualizada',
            description: 'Descrição atualizada',
            status: 'in progress',
        };

        const response = await request(app)
            .put(`/api/tasks/${task._id}`)
            .send(updatedTask)
            .expect(200); // Espera status 200 de sucesso

        expect(response.body.title).toBe(updatedTask.title);
        expect(response.body.description).toBe(updatedTask.description);
        expect(response.body.status).toBe(updatedTask.status);
    });

    // Teste de exclusão de uma tarefa
    it('deve excluir uma tarefa', async () => {
        const task = await Task.create({
            title: 'Tarefa a ser excluída',
            description: 'Descrição para exclusão',
            project: new mongoose.Types.ObjectId(), // Substitua com um ObjectId válido se necessário
        });

        const response = await request(app)
            .delete(`/api/tasks/${task._id}`)
            .expect(200); // Espera status 200 de sucesso

        expect(response.body.message).toBe('Tarefa deletada com sucesso');
        const deletedTask = await Task.findById(task._id);
        expect(deletedTask).toBeNull(); // Verifica se a tarefa foi realmente excluída
    });
});
