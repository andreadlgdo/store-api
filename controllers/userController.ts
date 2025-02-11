const bcrypt = require('bcrypt');

import { Request, Response } from 'express';

import User from '../models/User';


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json({users});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, type } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'La contraseña es obligatorio' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultType = type || 'client';

        const user = new User({
            username,
            email,
            password: hashedPassword,
            type: defaultType
        });

        await user.save();

        res.status(201).json({user});

    } catch (error) {
        res.status(500).json({message: 'Error al crear usuario', error: error});
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { username, email, type, imageUrl } = req.body;

        const updateFields: { [key: string]: any } = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (type) updateFields.type = type;
        if (imageUrl) updateFields.imageUrl = imageUrl;

        const updatedUser = await User.findByIdAndUpdate(
            {_id: id},
            { $set: updateFields },
            { new: true, runValidators: true }
        );


        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error });
    }
};
