import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from "./models/Product";

dotenv.config();

const app = express();

const PORT =process.env.PORT || '3000';

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', () => {
    console.log('API is running');
});

app.get('/api/products', async (req: Request, res: Response) => {
    try {
        console.time('a');
        const products = await Product.find();
        console.log('p', products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
