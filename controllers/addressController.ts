import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";
import Address from '../models/Address';
import { BadRequestError, NotFoundError } from '../utils';

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
};

export const findAddressByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const addresses = await Address.find({ userId: { $in: userId }});
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de dirección no válido');
        }

        const updateFields: { [key: string]: any } = {};
        const allowedFields = [
            'userId',
            'street',
            'number',
            'letter',
            'zipCode',
            'city',
            'country',
            'label',
            'isDefault'
        ];

        allowedFields.forEach(field => {
            if (req.body.hasOwnProperty(field)) {
                updateFields[field] = req.body[field];
            }
        });

        const updatedAddress = await Address.findByIdAndUpdate(
            {_id: id},
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            throw new NotFoundError('Dirección no encontrado');
        }

        res.status(200).json({ address: updatedAddress });
    } catch (error) {
        next(error);
    }
}

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, street, number, letter, zipCode, city, country, label, isDefault } = req.body;

        const address = new Address({
            userId, street, number, letter, zipCode, city, country, label, isDefault
        });

        await address.save();

        res.status(201).json({ address });
    } catch (error) {
        next(error);
    }
}

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de la dirección no válido');
        }

        const deletedAddress = await Address.findByIdAndDelete(id);
        if (!deletedAddress) {
            throw new NotFoundError('Dirección no encontrado');
        }

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}
