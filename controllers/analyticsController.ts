import { Request, Response, NextFunction } from 'express';
import ProductView from '../models/ProductView';
import Product from '../models/Product';
import mongoose from 'mongoose';

export const getMostViewedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categories } = req.query;
        const categoryFilter = categories ? { categories: { $in: Array.isArray(categories) ? categories : [categories] } } : {};

        // Aggregate product views to count views per product
        const productViews = await ProductView.aggregate([
            {
                $group: {
                    _id: '$productId',
                    viewCount: { $sum: 1 }
                }
            },
            {
                $sort: { viewCount: -1 }
            }
        ]);

        // Get product details for each viewed product with category filter
        const productIds = productViews.map(view => new mongoose.Types.ObjectId(view._id));
        const products = await Product.find({
            _id: { $in: productIds },
            ...categoryFilter
        });

        // Combine view counts with product details
        const productsWithViews = productViews
            .map(view => {
                const product = products.find(p => (p as any)._id.toString() === view._id.toString());
                return product ? {
                    product: product,
                    viewCount: view.viewCount
                } : null;
            })
            .filter(item => item !== null);

        res.json(productsWithViews);
    } catch (error) {
        next(error);
    }
};
