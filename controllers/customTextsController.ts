import { Request, Response, NextFunction } from 'express';
import CustomText from '../models/CustomText';

export const getCustomTexts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page } = req.query;
        const query = page ? { page } : {};
        const customTexts = await CustomText.find(query);
        res.json(customTexts);
    } catch (error) {
        next(error);
    }
};

export const updateCustomTexts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page } = req.params;
        const { texts } = req.body;

        if (!page || !texts) {
            return res.status(400).json({ message: 'Page and texts are required' });
        }

        const updatedCustomText = await CustomText.findOneAndUpdate(
            { page },
            { texts },
            { new: true, upsert: true }
        );

        res.json(updatedCustomText);
    } catch (error) {
        next(error);
    }
};
