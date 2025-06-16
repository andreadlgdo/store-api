import request from 'supertest';
import app from '../../app';
import User from '../../models/User';
const bcrypt = require('bcrypt');

describe('Auth Routes', () => {
  const userPassword = 'MiContraseñaSegura123';
  const userEmail = 'test@correo.com';

  beforeEach(async () => {
    process.env.JWT_SECRET = 'testsecret';
  
    const hashedPassword = await bcrypt.hash(userPassword, 10);
  
    await User.create({
      email: userEmail,
      password: hashedPassword,
      name: 'Test User',
      surname: 'Apellido',
      type: 'cliente',
      imageUrl: ''
    });
  });  

  it('POST /api/login debe autenticar con credenciales válidas y devolver token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: userEmail, password: userPassword });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(userEmail);
    expect(res.body.user.password).toBeUndefined(); // no se debe devolver
  });

  it('POST /api/login con email incorrecto debe devolver 401', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'otro@correo.com', password: userPassword });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/credenciales incorrectas/i);
  });

  it('POST /api/login con contraseña incorrecta debe devolver 401', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: userEmail, password: 'contraseñaIncorrecta' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/credenciales incorrectas/i);
  });
});
