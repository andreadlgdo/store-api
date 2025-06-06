import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";

import Product from '../models/Product';
import { BadRequestError, NotFoundError } from '../utils';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categories, name, order, discounted, hasStock, minPrice, maxPrice } = req.query;
        
        const filter: any = {};
        
        if (categories) {
            filter.categories = { $in: categories };
        }
        
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        // Add filter for discounted products
        if (discounted === 'true') {
            filter.priceWithDiscount = { $exists: true, $ne: null };
        } else if (discounted === 'false') {
            filter.priceWithDiscount = { $exists: false };
        }
        
        // Add price range filter
        if (minPrice || maxPrice) {
            const priceFilter = {
                $or: [
                    // Check regular price
                    {
                        price: {
                            ...(minPrice && { $gte: Number(minPrice) }),
                            ...(maxPrice && { $lte: Number(maxPrice) })
                        }
                    },
                    // Check discounted price if it exists
                    {
                        priceWithDiscount: {
                            $exists: true,
                            ...(minPrice && { $gte: Number(minPrice) }),
                            ...(maxPrice && { $lte: Number(maxPrice) })
                        }
                    }
                ]
            };
            filter.$and = filter.$and || [];
            filter.$and.push(priceFilter);
        }

        // Add filter for products with/without stock
        if (hasStock === 'true') {
            const stockFilter = {
                $or: [
                    // Products with uniqueStock > 0
                    { uniqueStock: { $gt: 0 } },
                    // Products with non-empty stock array and sum of quantities > 0
                    {
                        $and: [
                            { stock: { $exists: true, $ne: [] } },
                            { stock: { $elemMatch: { quantity: { $gt: 0 } } } }
                        ]
                    }
                ]
            };
            filter.$and = filter.$and || [];
            filter.$and.push(stockFilter);
        } else if (hasStock === 'false') {
            const noStockFilter = {
                $and: [
                    // Products with uniqueStock = 0 or doesn't exist
                    { $or: [
                        { uniqueStock: 0 },
                        { uniqueStock: { $exists: false } }
                    ]},
                    // Products with empty stock array or sum of quantities = 0
                    { $or: [
                        { stock: { $exists: false } },
                        { stock: [] },
                        { stock: { $not: { $elemMatch: { quantity: { $gt: 0 } } } } }
                    ]}
                ]
            };
            filter.$and = filter.$and || [];
            filter.$and.push(noStockFilter);
        }

        let products;
        if (order) {
            // Always sort by price in DB for efficiency
            let sortOrder: 1 | -1 = 1; // ascending
            if (order === 'desc') {
                sortOrder = -1;
            }
            products = await Product.find(filter).sort({ price: sortOrder } as Record<string, 1 | -1>);

            // Sort all products by their effective price (priceWithDiscount if available, otherwise price)
            products.sort((a: any, b: any) => {
                const aPrice = typeof a.priceWithDiscount === 'number' ? a.priceWithDiscount : a.price;
                const bPrice = typeof b.priceWithDiscount === 'number' ? b.priceWithDiscount : b.price;
                if (aPrice === bPrice) return 0;
                return sortOrder * (aPrice - bPrice);
            });
        } else {
            // No order provided, return products without sorting
            products = await Product.find(filter);
        }
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export const findProductsByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { ids } = req.params;

        if (!ids) {
            throw new BadRequestError("Se requiere un array de IDs de productos");
        }

        const productIds: string[] = (ids as string).split(',');
        const objectIds = productIds.map(id => new mongoose.Types.ObjectId(id));

        const products = await Product.find({ _id: { $in: objectIds } });

        res.json(products);
    } catch (error) {
        next(error);
    }
};

export const findProductByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const products = await Product.find({ isFavouriteUsersIds: { $in: [userId]} });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de producto no válido');
        }

        const updateFields: { [key: string]: any } = {};
        const allowedFields = [
            'name',
            'description',
            'price',
            'priceWithDiscount',
            'categories',
            'stock',
            'isUniqueSize',
            'uniqueStock',
            'imageUrl',
            'onSale',
            'isFavouriteUsersIds'
        ];

        allowedFields.forEach(field => {
            if (req.body[field]) {
                updateFields[field] = req.body[field];
            }
        });

        const updatedProduct = await Product.findByIdAndUpdate(
            {_id: id},
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            throw new NotFoundError('Producto no encontrado');
        }

        res.json({ product: updatedProduct });
    } catch (error) {
        next(error);
    }
}

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, categories, price, stock, isUniqueSize, uniqueStock, imageUrl, isFavouriteUsersIds } = req.body;

        const product = new Product({
            name,
            description,
            categories,
            price,
            stock,
            isUniqueSize,
            uniqueStock,
            imageUrl,
            isFavouriteUsersIds
        });

        await product.save();

        res.status(201).json({ product });
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de producto no válido');
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new NotFoundError('Producto no encontrado');
        }

        res.json({success: true});
    } catch (error) {
        next(error);
    }
}
