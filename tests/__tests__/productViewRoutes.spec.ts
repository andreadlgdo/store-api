import request from 'supertest';
import app from '../../app';
import ProductView from '../../models/ProductView';
import mongoose from 'mongoose';

describe('ProductView Routes - /api/productViews', () => {
  let userId: string;
  let productId: string;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId().toString();
    productId = new mongoose.Types.ObjectId().toString();

    await ProductView.create({
      userId,
      productId,
      timestamp: new Date()
    });
  });

  afterEach(async () => {
    await ProductView.deleteMany({});
  });

  it('GET /api/productViews/:userId devuelve vistas de productos del usuario', async () => {
    const res = await request(app).get(`/api/productViews/${userId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].userId).toBe(userId);
  });

  it('POST /api/productViews añade una nueva vista de producto', async () => {
    const res = await request(app).post('/api/productViews').send({
      userId,
      productId: new mongoose.Types.ObjectId().toString()
    });

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(userId);
    expect(res.body.productId).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });
});
