import { Request, Response, NextFunction } from 'express';
import ProductView from '../models/ProductView';

export const getProductViewsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const productViews = await ProductView.find({ userId });
    res.status(200).json(productViews);
};

export const addProductView = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.body;
    const productView = await ProductView.create({ userId, productId });
    res.status(201).json(productView);
};