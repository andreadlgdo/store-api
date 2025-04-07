import { Request, Response, NextFunction } from 'express';

import Image from '../models/Image';

export const getLandingImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const image = await Image.find({type: 'landing'});
        res.json(image);
    } catch (error) {
        next(error);
    }
};

export const getSectionsImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const image = await Image.find({type: 'section'});
        res.json(image);
    } catch (error) {
        next(error);
    }
};
