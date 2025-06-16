import request from 'supertest';
import app from '../../app';
import Category from '../../models/Category';
import mongoose from 'mongoose';

describe('Category Routes', () => {
  let categoryId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const category = await Category.create({
      title: 'Ropa',
      imageUrl: 'http://example.com/ropa.jpg',
      parentId: null,
      relatedId: ['id1', 'id2']
    });

    categoryId = category._id as mongoose.Types.ObjectId;
  });

  it('GET /api/category debe devolver todas las categorías', async () => {
    const res = await request(app).get('/api/category');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBe('Ropa');
  });

  it('GET /api/category/:id con ID válido debe devolver la categoría', async () => {
    const res = await request(app).get(`/api/category/${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.title).toBe('Ropa');
    expect(res.body._id).toBe(categoryId.toString());
  });

  it('GET /api/category/:id con ID inválido debe devolver error 500', async () => {
    const res = await request(app).get('/api/category/invalid-id');

    expect(res.status).toBe(500); // no hay validación manual, así que es un error de Mongoose
    expect(res.body.status).toBe('error');
  });

  it('GET /api/category/:id con ID no existente debe devolver null', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/category/${fakeId}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull(); // porque el controlador no lanza error si no encuentra nada
  });
});
