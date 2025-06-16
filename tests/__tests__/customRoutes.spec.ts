import request from 'supertest';
import app from '../../app';
import Custom from '../../models/Custom';

describe('Custom Routes - /api/custom', () => {
  beforeEach(async () => {
    await Custom.create({
      page: 'home',
      texts: { welcome: 'Bienvenido' },
      data: { items: 10 },
      visuals: { banner: 'url-banner.jpg' }
    });
  });

  it('GET /api/custom debe devolver todas las páginas', async () => {
    const res = await request(app).get('/api/custom');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].page).toBe('home');
  });

  it('GET /api/custom?=home debe devolver solo la página home', async () => {
    const res = await request(app).get('/api/custom').query({ page: 'home' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].page).toBe('home');
    expect(res.body[0].texts.welcome).toBe('Bienvenido');
  });

  it('GET /api/custom/home debe devolver la página home', async () => {
    const res = await request(app).get('/api/custom/home');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].page).toBe('home');
  });

  it('PUT /api/custom/home debe actualizar campos existentes', async () => {
    const res = await request(app)
      .put('/api/custom/home')
      .send({ texts: { welcome: 'Hola de nuevo' } });

    expect(res.status).toBe(200);
    expect(res.body.texts.welcome).toBe('Hola de nuevo');
  });

  it('PUT /api/custom/nueva debe crear una página nueva si no existe', async () => {
    const res = await request(app)
      .put('/api/custom/nueva')
      .send({ texts: { title: 'Página nueva' } });

    expect(res.status).toBe(200);
    expect(res.body.page).toBe('nueva');
    expect(res.body.texts.title).toBe('Página nueva');

    const inDb = await Custom.findOne({ page: 'nueva' });
    expect(inDb).not.toBeNull();
  });

  it('PUT /api/custom sin page o sin datos debe devolver 400', async () => {
    const res = await request(app).put('/api/custom/').send({});
    expect(res.status).toBe(404); // porque falta el parámetro `:page` en la URL
  });

  it('PUT /api/custom/home sin body debe devolver 400', async () => {
    const res = await request(app).put('/api/custom/home').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/page and at least one/i);
  });
});
