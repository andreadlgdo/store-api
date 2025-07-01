import express from 'express';
import { getMostViewedProducts, getMostPurchasedProducts } from '../controllers/analyticsController';

const router = express.Router();

router.get('/topProducts', getMostViewedProducts);
router.get('/topPurchased', getMostPurchasedProducts);

export default router; 