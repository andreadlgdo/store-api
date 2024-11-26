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
