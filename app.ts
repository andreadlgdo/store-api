import express from 'express';
import cors from 'cors';

import {
  addressRoutes,
  analyticsRoutes,
  authRoutes,
  categoryRoutes,
  customRoutes,
  generalRoutes,
  imageRoutes,
  orderRoutes,
  productRoutes,
  productViewRoutes,
  recommendationRoutes,
  userRoutes
} from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/addresses', addressRoutes);
app.use('/api/login', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/custom', customRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/productViews', productViewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Middleware de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ status: 'error', statusCode, message });
});

export default app;