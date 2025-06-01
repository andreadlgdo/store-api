import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {
    addressRoutes,
    authRoutes,
    categoryRoutes,
    customRoutes,
    generalRoutes,
    imageRoutes,
    orderRoutes,
    productRoutes,
    userRoutes
} from './routes';

dotenv.config();

const app = express();

app.use(cors());

const PORT =process.env.PORT || '3000';

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/addresses', addressRoutes);

app.use('/api/login', authRoutes);

app.use('/api/category', categoryRoutes);

app.use('/api/custom', customRoutes);

app.use('/api/general', generalRoutes);

app.use('/api/images', imageRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
