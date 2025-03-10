import express from 'express';
import { getOrders, findOrdersByUserId, addOrder, updateOrder } from "../controllers/ordersController";

const router = express.Router();

router.get('/', getOrders);
router.get('/user/:userId', findOrdersByUserId);
router.post('/', addOrder);
router.put('/:id', updateOrder);

export default router;
