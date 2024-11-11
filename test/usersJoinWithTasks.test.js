const request = require('supertest');
const app = require('../app'); // Caminho para seu arquivo principal do Express
const mongoose = require('mongoose');
const Task = require('../src/models/tasks');
const User = require('../src/models/user');

describe('Task Controller', () => {
  let taskId;
  let userId;

  beforeAll(async () => {
    // Conecte-se ao banco de dados de teste
    await mongoose.connect('mongodb://localhost:27018/scrum-manager-test');

    // Cria uma tarefa e um usuário para os testes
    const task = await Task.create({ title: 'Test Task' });
    const user = await User.create({ name: 'Test User' });
    // SAlvando a tarefa e o usuário para poder executar os testes
    await task.save();
    await user.save();

    taskId = task._id;
    userId = user._id;
  });

  afterAll(async () => {
    // Limpa os dados de teste e fecha a conexão com o banco de dados
    await Task.deleteMany();
    await User.deleteMany();
    await mongoose.connection.close();
  });

  it('deve adicionar um responsável a uma tarefa', async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/add-responsible`)
      .send({ userId })
      .expect(200);

    expect(response.body).toHaveProperty('responsibles');
    expect(response.body.responsibles).toContain(userId.toString());
  });

  it('deve retornar erro ao adicionar um responsável que já está na tarefa', async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/add-responsible`)
      .send({ userId })
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Usuário já é responsável por esta tarefa');
  });

  it('deve remover um responsável de uma tarefa', async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/remove-responsible`)
      .send({ userId })
      .expect(200);

    expect(response.body).toHaveProperty('responsibles');
    expect(response.body.responsibles).not.toContain(userId.toString());
  });

  it('deve retornar erro ao remover um responsável que não está na tarefa', async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/remove-responsible`)
      .send({ userId })
      .expect(200);

    expect(response.body.responsibles).not.toContain(userId.toString());
  });
});
