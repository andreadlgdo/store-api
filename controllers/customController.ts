import { Request, Response, NextFunction } from 'express';
import Custom from '../models/Custom';

export const getCustom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page } = req.query;
        const query = page ? { page } : {};
        const custom = await Custom.find(query);
        res.json(custom);
    } catch (error) {
        next(error);
    }
};

export const updateCustom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page } = req.params;
        const { texts, data, visuals } = req.body;

        if (!page || (!texts && !data && !visuals)) {
            return res.status(400).json({ message: 'Page and at least one of texts or data or visuals is required' });
        }

        const updateObject: any = {};
        if (texts) updateObject.texts = texts;
        if (data) updateObject.data = data;
        if (visuals) updateObject.visuals = visuals;

        const updatedCustomText = await Custom.findOneAndUpdate(
            { page },
            updateObject,
            { new: true, upsert: true }
        );

        res.json(updatedCustomText);
    } catch (error) {
        next(error);
    }
};
