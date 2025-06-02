import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import mongoose from 'mongoose';

export const getTopCategoriesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        // Get all orders for the user
        const orders = await Order.find({ userId });

        // Extract all product IDs from all orders
        const productIds = orders.flatMap(order => 
            order.products.map(product => new mongoose.Types.ObjectId(product.productId))
        );

        // Get all products with their categories
        const products = await Product.find({ _id: { $in: productIds } });

        // Count categories
        const categoryCount = products.reduce((acc, product) => {
            product.categories.forEach(category => {
                acc[category] = (acc[category] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        // Sort categories by count and get top 3
        const topCategories = Object.entries(categoryCount)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 3)
            .map(([category]) => category);

        res.json({ topCategories });
    } catch (error) {
        next(error);
    }
};