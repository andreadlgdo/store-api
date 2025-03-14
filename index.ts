import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {
    addressRoutes,
    authRoutes,
    categoryRoutes,
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

app.use('/api/general', generalRoutes);

app.use('/api/images', imageRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
