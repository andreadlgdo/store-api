import request from 'supertest';
import app from '../../app';
import ProductView from '../../models/ProductView';
import Product from '../../models/Product';
import mongoose from 'mongoose';

describe('Analytics Routes - /api/analytics/topProducts', () => {
  let productId1: mongoose.Types.ObjectId;
  let productId2: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const product1 = await Product.create({
      name: 'Producto A',
      description: 'Desc A',
      price: 10,
      priceWithDiscount: 8,
      categories: ['ropa', 'oferta'],
      imageUrl: 'http://imagen1.com',
      onSale: true,
      isFavouriteUsersIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const product2 = await Product.create({
      name: 'Producto B',
      description: 'Desc B',
      price: 20,
      priceWithDiscount: 15,
      categories: ['zapatos'],
      imageUrl: 'http://imagen2.com',
      onSale: false,
      isFavouriteUsersIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    productId1 = product1._id as mongoose.Types.ObjectId;
    productId2 = product2._id as mongoose.Types.ObjectId;

    await ProductView.create([
      { userId: 'user1', productId: productId1, timestamp: new Date() },
      { userId: 'user2', productId: productId1, timestamp: new Date() },
      { userId: 'user3', productId: productId2, timestamp: new Date() }
    ]);
  });

  it('GET /api/analytics/topProducts devuelve productos con número de vistas', async () => {
    const res = await request(app).get('/api/analytics/topProducts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);

    const [first, second] = res.body;

    expect(first.product.name).toBe('Producto A');
    expect(first.viewCount).toBe(2);

    expect(second.product.name).toBe('Producto B');
    expect(second.viewCount).toBe(1);
  });

  it('GET /api/analytics/topProducts?categories=ropa filtra por categoría', async () => {
    const res = await request(app).get('/api/analytics/topProducts?categories=ropa');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].product.categories).toContain('ropa');
  });

  it('GET /api/analytics/topProducts?categories=zapatos devuelve solo Producto B', async () => {
    const res = await request(app).get('/api/analytics/topProducts?categories=zapatos');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].product.name).toBe('Producto B');
  });
});
