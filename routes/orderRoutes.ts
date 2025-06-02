import express from 'express';
import {getOrders, findOrdersByUserId, addOrder, updateOrder, deleteOrder} from "../controllers/ordersController";

const router = express.Router();

router.get('/', getOrders);
router.get('/:userId', findOrdersByUserId);
router.post('/', addOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
