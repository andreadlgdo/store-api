import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";


export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find();

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error });
    }
};

export const findOrdersByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId: userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de pedido no válido' });
        }

        const updateFields: { [key: string]: any } = {};
        const allowedFields = [
            'userId',
            'status',
            'products'
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
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar un pedido', error: error });
    }
}

export const addOrder = async (req: Request, res: Response) => {
    try {
        const { userId, status, products } = req.body;

        const order = new Order({
            userId,
            status,
            products
        });

        await order.save();

        res.status(201).json({ order });

    } catch (error) {
        res.status(500).json({message: 'Error al crear un pedido', error: error});
    }
}
