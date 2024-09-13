const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import User from '../models/User.js';

export const login = async (req:Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Buscar el usuario por email
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { user: user },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.json({ token, user: user });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
