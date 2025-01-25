import { Request, Response } from 'express';

import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { categories } = req.query;
        const products = await Product.find(categories?.length ? { categories: { $in: categories }  }: {})
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { name, description, price, categories, quantity, imageUrl } = req.body;

        const updateFields: { [key: string]: any } = {};

        if (name) updateFields.name = name;
        if (price) updateFields.price = price;
        updateFields.description = description;
        updateFields.categories = categories;
        updateFields.quantity = quantity;
        updateFields.imageUrl = imageUrl;

        const updatedProduct = await Product.findByIdAndUpdate(
            {_id: id},
            { $set: updateFields },
            { new: true, runValidators: true }
        );


        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ user: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar un producto', error: error });
    }
}
