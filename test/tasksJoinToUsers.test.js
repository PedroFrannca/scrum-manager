const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Substitua pelo caminho correto para seu arquivo principal (app.js ou server.js)
const User = require('../src/models/user');
const Task = require('../src/models/tasks');

describe('User Controller - Associar Tarefas', () => {
  let userId;
  let taskId;

  // Conecta ao banco de dados e cria um usuário e uma tarefa para os testes
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27018/scrum-manager-test');

    const user = await User.create({ name: 'Test User' });
    const task = await Task.create({ title: 'Test Task' });

    await user.save();
    await task.save();

    userId = user._id;
    taskId = task._id;

  });

  // Limpa os dados de teste do banco após os testes
  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  it('deve adicionar uma tarefa ao usuário', async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/add-task/${taskId}`)
      .expect(200);

    expect(response.body).toHaveProperty('myTasks');
    expect(response.body.myTasks).toContain(taskId.toString());
  });

  it('não deve adicionar uma tarefa ao usuário se ela já estiver associada', async () => {
    // Tentativa de adicionar a mesma tarefa novamente
    const response = await request(app)
      .post(`/api/users/${userId}/add-task/${taskId}`)
      .expect(400);

    expect(response.body.message).toBe('Tarefa já associada ao usuário');
  });

  it('deve remover uma tarefa do usuário', async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/remove-task/${taskId}`)
      .expect(200);

    expect(response.body).toHaveProperty('myTasks');
    expect(response.body.myTasks).not.toContain(taskId.toString());
  });

  it('não deve falhar ao remover uma tarefa que já foi removida', async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/remove-task/${taskId}`)
      .expect(200);

    expect(response.body).toHaveProperty('myTasks');
    expect(response.body.myTasks).not.toContain(taskId.toString());
  });
});
