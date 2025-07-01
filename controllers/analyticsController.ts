import { Request, Response, NextFunction } from 'express';
import ProductView from '../models/ProductView';
import Product from '../models/Product';
import Order from '../models/Order';
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

        res.status(200).json(productsWithViews);
    } catch (error) {
        next(error);
    }
};

export const getMostPurchasedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categories } = req.query;
        const categoryFilter = categories ? { categories: { $in: Array.isArray(categories) ? categories : [categories] } } : {};

        // Aggregate orders with "paid" status to count units sold per product
        const productPurchases = await Order.aggregate([
            {
                $match: { status: 'paid' }
            },
            {
                $unwind: '$products'
            },
            {
                $group: {
                    _id: '$products.productId',
                    totalUnits: { $sum: { $toInt: '$products.units' } }
                }
            },
            {
                $sort: { totalUnits: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Get product details for each purchased product with category filter
        const productIds = productPurchases.map(purchase => new mongoose.Types.ObjectId(purchase._id));
        const products = await Product.find({
            _id: { $in: productIds },
            ...categoryFilter
        });

        // Combine purchase counts with product details
        const productsWithPurchases = productPurchases
            .map(purchase => {
                const product = products.find(p => (p as any)._id.toString() === purchase._id.toString());
                return product ? {
                    product: product,
                    totalUnits: purchase.totalUnits
                } : null;
            })
            .filter(item => item !== null);

        res.status(200).json(productsWithPurchases);
    } catch (error) {
        next(error);
    }
};
