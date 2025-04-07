import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { BadRequestError, NotFoundError } from '../utils';

const bcrypt = require('bcrypt');

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        res.json({ users });
    } catch (error) {
        next(error);
    }
};

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, surname, email, password, type } = req.body;

        if (!password) {
            throw new BadRequestError('La contraseña es obligatoria');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultType = type || 'client';

        const user = new User({
            name,
            surname,
            email,
            password: hashedPassword,
            type: defaultType
        });

        await user.save();

        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de usuario no válido');
        }

        const { name, surname, email, type, imageUrl } = req.body;

        const updateFields: { [key: string]: any } = {};
        if (name) updateFields.name = name;
        if (surname) updateFields.surname = surname;
        if (email) updateFields.email = email;
        if (type) updateFields.type = type;
        if (imageUrl) updateFields.imageUrl = imageUrl;

        const updatedUser = await User.findByIdAndUpdate(
            {_id: id},
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new NotFoundError('Usuario no encontrado');
        }

        res.json({ user: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de usuario no válido');
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new NotFoundError('Usuario no encontrado');
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}
