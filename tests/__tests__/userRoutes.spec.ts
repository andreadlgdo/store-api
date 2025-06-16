const bcrypt = require('bcrypt');
import request from 'supertest';
import app from '../../app';
import User from '../../models/User';
import mongoose from 'mongoose';

describe('User Routes', () => {
  let userId: string;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await User.create({
      name: 'Andrea',
      surname: 'Delgado',
      email: 'andrea@example.com',
      password: hashedPassword,
      type: 'admin'
    });

    userId = (user._id as mongoose.Types.ObjectId).toString();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('GET /api/users devuelve todos los usuarios', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0].email).toBe('andrea@example.com');
  });

  it('POST /api/users crea un nuevo usuario', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'Nuevo',
      surname: 'Usuario',
      email: 'nuevo@example.com',
      password: 'pass123',
      type: 'client'
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('nuevo@example.com');

    const user = await User.findOne({ email: 'nuevo@example.com' });
    expect(user).not.toBeNull();
    expect(await bcrypt.compare('pass123', user!.password)).toBe(true);
  });

  it('PUT /api/users/:id actualiza un usuario existente', async () => {
    const res = await request(app).put(`/api/users/${userId}`).send({
      name: 'NombreActualizado',
      imageUrl: 'http://imagen.com'
    });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('NombreActualizado');
    expect(res.body.user.imageUrl).toBe('http://imagen.com');
  });

  it('DELETE /api/users/:id elimina un usuario existente', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const deleted = await User.findById(userId);
    expect(deleted).toBeNull();
  });

  it('POST /api/users sin contraseña devuelve error 400', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'Error',
      surname: 'User',
      email: 'error@example.com'
    });

    expect(res.status).toBe(400);
  });

  it('PUT /api/users con ID inválido devuelve error 400', async () => {
    const res = await request(app).put('/api/users/123').send({ name: 'Test' });
    expect(res.status).toBe(400);
  });

  it('DELETE /api/users con ID inválido devuelve error 400', async () => {
    const res = await request(app).delete('/api/users/123');
    expect(res.status).toBe(400);
  });
});
