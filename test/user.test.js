const request = require('supertest');
const app = require('../app');  // Importando o arquivo app.js com o servidor Express
const mongoose = require('mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/tasks');

describe('Testes de rotas de usuários', () => {
  beforeAll(async () => {
    // Conectar ao banco de dados antes de rodar os testes
    await mongoose.connect('mongodb://localhost:27018/scrum-manager-test');
  });

  afterAll(async () => {
    // Limpa a base de dados de testes após os testes
    await mongoose.connection.db.dropDatabase();
    // Fechar a conexão com o banco de dados após os testes
    await mongoose.connection.close();
  });

  // Teste para criar um usuário
  it('deve criar um novo usuário', async () => {
    // Criando uma tarefa para associar ao usuário
    const task = new Task({
      title: 'Desenvolver API',
    });
    await task.save();

    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'João Silva',
        myTasks: [task._id], // Associando a tarefa criada ao usuário
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuário criado com sucesso');
    expect(response.body.user.name).toBe('João Silva');
    expect(response.body.user.myTasks).toHaveLength(1);
  });

  // Teste para listar os usuários
  it('deve listar todos os usuários', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Teste para atualizar um usuário
  it('deve atualizar um usuário', async () => {
    // Criando o usuário inicialmente
    const user = new User({
      name: 'Lucas Pereira',
    });
    await user.save();

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({
        name: 'Lucas Pereira Updated',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Usuário atualizado com sucesso');
    expect(response.body.user.name).toBe('Lucas Pereira Updated');
  });

  // Teste para deletar um usuário
  it('deve deletar um usuário', async () => {
    // Criando o usuário inicialmente
    const user = new User({
      name: 'Carlos Alberto',
    });
    await user.save();

    const response = await request(app).delete(`/api/users/${user._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Usuário deletado com sucesso');
  });
});
