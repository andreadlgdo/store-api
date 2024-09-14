import mongoose from "mongoose";

const bcrypt = require('bcrypt');

import { Request, Response } from 'express';

import User from '../models/User';


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, type } = req.body;

        let defaultType;
        if (type === undefined) {
            defaultType = 'client';
        }
        const _id = new mongoose.Types.ObjectId().toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            _id,
            username,
            email,
            password: hashedPassword,
            type: type ?? defaultType
        });

        await user.save();

        res.status(201).json({user: user});

    } catch (error) {
        res.status(500).json({message: 'Error al crear usuario', error: error});
    }
};
