import { Request, Response, NextFunction } from 'express';

import Category from "../models/Category";

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategoriesById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        res.json(category);
    } catch (error) {
        next(error);
    }
};
