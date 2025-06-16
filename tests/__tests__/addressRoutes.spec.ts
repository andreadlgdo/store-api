import request from 'supertest';
import app from '../../app';
import Address from '../../models/Address';

describe('Address Routes', () => {
  let createdAddress: any;

  beforeEach(async () => {
    createdAddress = await Address.create({
      userId: '123',
      street: 'Calle Prueba',
      number: '1',
      letter: 'A',
      zipCode: '12345',
      city: 'Oviedo',
      country: 'España',
      label: 'Casa',
      isDefault: true
    });
  });

  it('GET /api/addresses debe devolver 200 y datos', async () => {
    const res = await request(app).get('/api/addresses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].street).toBe('Calle Prueba');
  });

  it('GET /api/addresses/:userId con userId válido debe devolver 200 y datos', async () => {
    const res = await request(app).get(`/api/addresses/${createdAddress.userId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].userId).toBe('123');
  });

  it('POST /api/addresses debe crear una dirección y devolver 201', async () => {
    const newAddress = {
      userId: '456',
      street: 'Nueva Calle',
      number: '5',
      letter: 'B',
      zipCode: '33000',
      city: 'Gijón',
      country: 'España',
      label: 'Piso',
      isDefault: false
    };

    const res = await request(app).post('/api/addresses').send(newAddress);
    expect(res.status).toBe(201);
    expect(res.body.address.street).toBe('Nueva Calle');
    expect(res.body.address.userId).toBe('456');
  });

  it('PUT /api/addresses/:id debe actualizar una dirección válida', async () => {
    const res = await request(app)
      .put(`/api/addresses/${createdAddress._id}`)
      .send({ street: 'Calle Actualizada' });

    expect(res.status).toBe(200);
    expect(res.body.address.street).toBe('Calle Actualizada');
  });

  it('PUT /api/addresses/:id con id inválido debe devolver error 400', async () => {
    const res = await request(app)
      .put('/api/addresses/invalid-id')
      .send({ street: 'No sirve' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/ID de dirección no válido/i);
  });

  it('DELETE /api/addresses/:id debe borrar una dirección existente', async () => {
    const res = await request(app).delete(`/api/addresses/${createdAddress._id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verifica que se haya eliminado
    const check = await Address.findById(createdAddress._id);
    expect(check).toBeNull();
  });

  it('DELETE /api/addresses/:id con id inválido debe devolver error 400', async () => {
    const res = await request(app).delete('/api/addresses/invalid-id');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/ID de la dirección no válido/i);
  });
});
