import request from 'supertest';
import app from '../../app';
import Image from '../../models/Image';

describe('General Routes - /api/general', () => {
  beforeEach(async () => {
    await Image.create([
      { type: 'landing', imageUrl: 'https://example.com/landing.jpg', device: 'desktop' },
      { type: 'section', imageUrl: 'https://example.com/section.jpg', device: 'mobile' }
    ]);
  });

  afterEach(async () => {
    await Image.deleteMany({});
  });

  it('GET /api/general/landing devuelve imágenes de tipo landing', async () => {
    const res = await request(app).get('/api/general/landing');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].type).toBe('landing');
    expect(res.body[0].imageUrl).toMatch(/^https?:\/\//);
  });

  it('GET /api/general/section devuelve imágenes de tipo section', async () => {
    const res = await request(app).get('/api/general/section');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].type).toBe('section');
    expect(res.body[0].device).toBe('mobile');
  });
});
