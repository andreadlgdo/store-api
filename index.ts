import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes';
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/imageRoutes";

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


app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes);

app.use('/api/login', authRoutes);

app.use('/api/images', imageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
