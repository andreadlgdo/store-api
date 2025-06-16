import request from 'supertest';
import app from '../../app';
import Product from '../../models/Product';
import mongoose from 'mongoose';

describe('Product Routes', () => {
  let productId: string;

  beforeEach(async () => {
    const product = await Product.create({
      name: 'Producto Test',
      description: 'Descripción de prueba',
      price: 100,
      priceWithDiscount: 80,
      categories: ['ropa'],
      stock: [{ quantity: 10, size: 'M' }],
      isUniqueSize: false,
      uniqueStock: 5,
      imageUrl: 'https://imagen.com/test.jpg',
      onSale: true,
      isFavouriteUsersIds: ['123'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    productId = (product._id as mongoose.Types.ObjectId).toString();
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  it('GET /api/products devuelve todos los productos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/products/:ids devuelve productos por IDs', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body[0]._id).toBe(productId);
  });

  it('GET /api/products/user/:userId devuelve productos favoritos del usuario', async () => {
    const res = await request(app).get('/api/products/user/123');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/products crea un nuevo producto', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Nuevo Producto',
      description: 'Desc',
      price: 50,
      categories: ['accesorios'],
      imageUrl: 'https://imagen.com/nuevo.jpg',
      isFavouriteUsersIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    expect(res.status).toBe(201);
    expect(res.body.product.name).toBe('Nuevo Producto');
  });

  it('PUT /api/products/:id actualiza un producto existente', async () => {
    const res = await request(app).put(`/api/products/${productId}`).send({
      name: 'Producto Actualizado'
    });

    expect(res.status).toBe(200);
    expect(res.body.product.name).toBe('Producto Actualizado');
  });

  it('DELETE /api/products/:id elimina un producto', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/products?discounted=true devuelve productos con descuento', async () => {
    const res = await request(app).get('/api/products?discounted=true');
    expect(res.status).toBe(200);
    expect(res.body[0].priceWithDiscount).toBeDefined();
  });

  it('GET /api/products?hasStock=true devuelve productos con stock', async () => {
    const res = await request(app).get('/api/products?hasStock=true');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
