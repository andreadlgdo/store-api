import { Request, Response, NextFunction } from 'express';

import Category from "../models/Category";

export const getCategoriesImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};
