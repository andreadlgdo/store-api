import { Request, Response } from 'express';
import mongoose from "mongoose";

import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { categories } = req.query;
        const categoriesFilter = Array.isArray(categories) && categories.length
            ? { categories: { $in: categories } }
            : {};

        const products = await Product.find(categoriesFilter);
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
        const allowedFields = ['name', 'description', 'price', 'categories', 'quantity', 'imageUrl'];

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
        const { name, description, categories, price, quantity, imageUrl } = req.body;

        const product = new Product({
            name,
            description,
            categories,
            price,
            quantity,
            imageUrl
        });

        await product.save();

        res.status(201).json({ product });

    } catch (error) {
        res.status(500).json({message: 'Error al crear un producto', error: error});
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de producto no válido' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar un producto', error: error });
    }
}
