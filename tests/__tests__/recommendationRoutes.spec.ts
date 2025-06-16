import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import Order from '../../models/Order';
import Product from '../../models/Product';
import ProductView from '../../models/ProductView';

describe('Recommendation Routes', () => {
  let userId: string;
  let productId1: mongoose.Types.ObjectId;
  let productId2: mongoose.Types.ObjectId;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId().toString();
    productId1 = new mongoose.Types.ObjectId();
    productId2 = new mongoose.Types.ObjectId();

    await Product.create([
      {
        _id: productId1,
        name: 'Product A',
        price: 100,
        categories: ['ropa', 'zapatos'],
        isFavouriteUsersIds: [userId],
        imageUrl: '',
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: productId2,
        name: 'Product B',
        price: 80,
        categories: ['ropa', 'accesorios'],
        isFavouriteUsersIds: [],
        imageUrl: '',
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await Order.create({
      userId,
      user: { name: 'A', surname: 'B', email: 'a@b.com' },
      address: {
        street: 'Calle Falsa',
        number: '123',
        letter: 'A',
        zipCode: '33000',
        city: 'Oviedo',
        country: 'España'
      },
      status: 'paid',
      products: [
        { productId: productId1.toString(), units: '1' },
        { productId: productId2.toString(), units: '2' }
      ],
      promotionCode: '',
      total: 180,
      timestamp: new Date()
    });

    await ProductView.create([
      { userId, productId: productId1.toString(), timestamp: new Date() },
      { userId, productId: productId2.toString(), timestamp: new Date() }
    ]);
  });

  afterEach(async () => {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await ProductView.deleteMany({});
  });

  it('GET /orders/:userId devuelve categorías principales desde pedidos', async () => {
    const res = await request(app).get(`/api/recommendations/orders/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.topCategories).toContain('ropa');
  });

  it('GET /favourites/:userId devuelve categorías desde favoritos', async () => {
    const res = await request(app).get(`/api/recommendations/favourites/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.topCategories).toContain('ropa');
  });

  it('GET /productViews/:userId devuelve categorías desde vistas', async () => {
    const res = await request(app).get(`/api/recommendations/productViews/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.topCategories).toContain('ropa');
  });
});
