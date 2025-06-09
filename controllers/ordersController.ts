import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import { BadRequestError, NotFoundError } from '../utils';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const findOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId: userId });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de pedido no válido');
        }

        const updateFields: { [key: string]: any } = {};
        const allowedFields = [
            'userId',
            'user',
            'address',
            'status',
            'products',
            'promotionCode',
            'total'
        ];

        allowedFields.forEach(field => {
            if (req.body[field]) {
                updateFields[field] = req.body[field];
            }
        });

        const updatedOrder = await Order.findByIdAndUpdate(
            {_id: id},
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            throw new NotFoundError('Pedido no encontrado');
        }

        res.json({ order: updatedOrder });
    } catch (error) {
        next(error);
    }
}

export const addOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, user, address, status, products, promotionCode, total } = req.body;

        const order = new Order({
            userId,
            user,
            address,
            status,
            products,
            promotionCode,
            total,
            timestamp: new Date()
        });

        await order.save();

        res.status(201).json({ order });
    } catch (error) {
        next(error);
    }
}

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID de pedido no válido');
        }

        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            throw new NotFoundError('Pedido no encontrado');
        }

        res.json({success: true});
    } catch (error) {
        next(error);
    }
}
