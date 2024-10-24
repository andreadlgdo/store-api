import { Request, Response } from 'express';

import Image from '../models/Image';

export const getLandingImage = async (req: Request, res: Response) => {
    try {
        const image = await Image.find({type: 'landing'});
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching landing images', error });
    }
};
