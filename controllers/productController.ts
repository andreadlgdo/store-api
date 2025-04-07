import { Request, Response } from 'express';
import mongoose from "mongoose";

import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { categories } = req.query;


        const products = await Product.find(categories ? { categories: { $in: categories } } : {});

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error });
    }
};

export const findProductsByIds = async (req: Request, res: Response) => {
    try {
        let { ids } = req.params;

        if (!ids) {
            return res.status(400).json({ message: "Se requiere un array de IDs de productos" });
        }

        const productIds: string[] = (ids as string).split(',');
        const objectIds = productIds.map(id => new mongoose.Types.ObjectId(id));

        const products = await Product.find({ _id: { $in: objectIds } });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos por IDs", error });
    }
};


export const findProductByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const products = await Product.find({ isFavouriteUsersIds: { $in: [userId]} });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de producto no válido' });
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
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar un producto', error: error });
    }
}

export const addProduct = async (req: Request, res: Response) => {
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
        res.status(500).json({message: 'Error al crear un producto', error: error});
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'ID de producto no válido'});
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({message: 'Producto no encontrado'});
        }

        res.json({success: true});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar un producto', error: error});
    }
}
