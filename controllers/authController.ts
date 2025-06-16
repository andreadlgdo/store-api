const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { UnauthorizedError } from '../utils';

export const login = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            throw new UnauthorizedError('Credenciales incorrectas');
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError('Credenciales incorrectas');
        }

        // Generar token JWT
        const token = jwt.sign(
            { user: user },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        // Excluir la contraseña antes de enviar la respuesta
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};
