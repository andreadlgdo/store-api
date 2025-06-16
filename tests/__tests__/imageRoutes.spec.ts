import request from 'supertest';
import app from '../../app';
import path from 'path';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// Mock de AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn(),
  CopyObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  ObjectCannedACL: {
    public_read: 'public-read',
  },
}));

beforeEach(() => {
  process.env.AWS_REGION = 'eu-west-1';
  process.env.S3_BUCKET_NAME = 'test-bucket';
});

describe('Image Routes - /api/images', () => {
  it('POST /api/images debe subir una imagen correctamente', async () => {
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

    const res = await request(app)
      .post('/api/images')
      .field('routeImage', 'productos/test-image.png')
      .attach('image', testImagePath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.imageUrl).toContain('https://');
  });

  it('POST /api/images sin archivo debe devolver 400', async () => {
    const res = await request(app).post('/api/images').field('routeImage', 'productos/test.png');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/no se ha subido ninguna imagen/i);
  });

  it('POST /api/images/updated renombra imagen correctamente', async () => {
    const res = await request(app).post('/api/images/updated').send({
      folder: 'productos',
      oldImageName: 'imagen-vieja.jpg',
      newImageName: 'imagen-nueva.jpg'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.imageUrl).toContain('https://');
  });

  it('POST /api/images/updated sin datos debe devolver 400', async () => {
    const res = await request(app).post('/api/images/updated').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/se deben proporcionar ambos nombres/i);
  });

  it('POST /api/images/deleted elimina imagen correctamente', async () => {
    const res = await request(app).post('/api/images/deleted').send({
      folder: 'productos',
      imageToRemove: 'imagen-a-borrar.jpg'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/eliminada/i);
  });

  it('POST /api/images/deleted sin datos debe devolver 400', async () => {
    const res = await request(app).post('/api/images/deleted').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/se debe proporcionar un nombre/i);
  });
});
