import { Request, Response } from 'express';
import mongoose from "mongoose";

import Address from '../models/Address';

export const getAddresses = async (req: Request, res: Response) => {
    try {
        const addresses = await Address.find();
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error });
    }
};

export const findAddressByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const addresses = await Address.find({ userId: { $in: userId }});
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de dirección no válido' });
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
            return res.status(404).json({ message: 'Dirección no encontrado' });
        }

        res.json({ address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar un dirección', error: error });
    }
}

export const addAddress = async (req: Request, res: Response) => {
    try {
        const { userId, street, number, letter, zipCode, city, country, label, isDefault } = req.body;

        const address = new Address({
            userId, street, number, letter, zipCode, city, country, label, isDefault
        });

        await address.save();

        res.status(201).json({ address });

    } catch (error) {
        res.status(500).json({message: 'Error al crear una dirección', error: error});
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de la dirección no válido' });
        }

        const deletedAddress = await Address.findByIdAndDelete(id);
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Dirección no encontrado' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar una dirección', error: error });
    }
}
