import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";

import Product from '../models/Product';
import { BadRequestError, NotFoundError } from '../utils';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categories, name, id } = req.query;
        
        const filter: any = {};
        
        if (categories) {
            filter.categories = { $in: categories };
        }
        
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        const products = await Product.find(filter);
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
