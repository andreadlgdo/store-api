import express from 'express';
import { addProductView, getProductViewsByUserId } from '../controllers/productViewController';

const router = express.Router();

router.get('/:userId', getProductViewsByUserId);
router.post('/', addProductView);

export default router;