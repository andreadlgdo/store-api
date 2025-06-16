import request from 'supertest';
import app from '../../app';
import Order from '../../models/Order';
import mongoose from 'mongoose';

describe('Order Routes', () => {
  let orderId: string;
  let userId = 'user123';

  const orderData = {
    userId,
    user: {
      name: 'Andrea',
      surname: 'Delgado',
      email: 'andrea@example.com'
    },
    address: {
      street: 'Calle A',
      number: '12',
      letter: 'B',
      zipCode: '33001',
      city: 'Oviedo',
      country: 'España'
    },
    status: 'pending',
    products: [
      { units: '2', size: 'M', productId: 'prod1' },
      { units: '1', size: 'L', productId: 'prod2' }
    ],
    promotionCode: 'SALE20',
    total: 45.5
  };

  beforeEach(async () => {
    const order = await Order.create(orderData);
    orderId = (order._id as mongoose.Types.ObjectId).toString();
  });

  afterEach(async () => {
    await Order.deleteMany({});
  });

  it('GET /api/orders debe devolver todos los pedidos', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user.name).toBe('Andrea');
  });

  it('GET /api/orders/:userId debe devolver pedidos del usuario', async () => {
    const res = await request(app).get(`/api/orders/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body[0].user.email).toBe('andrea@example.com');
  });

  it('POST /api/orders debe crear un pedido', async () => {
    const res = await request(app).post('/api/orders').send(orderData);
    expect(res.status).toBe(201);
    expect(res.body.order.status).toBe('pending');
    expect(res.body.order.user.name).toBe('Andrea');
  });

  it('PUT /api/orders/:id debe actualizar un pedido válido', async () => {
    const res = await request(app).put(`/api/orders/${orderId}`).send({
      status: 'shipped'
    });
    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('shipped');
  });

  it('PUT /api/orders/:id con ID inválido debe devolver 400', async () => {
    const res = await request(app).put(`/api/orders/invalid-id`).send({
      status: 'shipped'
    });
    expect(res.status).toBe(400);
  });

  it('DELETE /api/orders/:id debe eliminar un pedido', async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/orders/:id con ID inválido debe devolver 400', async () => {
    const res = await request(app).delete('/api/orders/invalid-id');
    expect(res.status).toBe(400);
  });
});
