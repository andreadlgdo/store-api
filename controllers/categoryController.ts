import { Request, Response } from 'express';

import Category from "../models/Category";

export const getCategoriesImages = async (req: Request, res: Response) => {
    try {
        const image = await Category.find();
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories images', error });
    }
};
