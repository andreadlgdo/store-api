import express from 'express';
import { getMostViewedProducts, getMostPurchasedProducts, getMostViewedCategories, getMostPurchasedCategories } from '../controllers/analyticsController';

const router = express.Router();

router.get('/topProducts', getMostViewedProducts);
router.get('/topPurchased', getMostPurchasedProducts);
router.get('/topCategories', getMostViewedCategories);
router.get('/topPurchasedCategories', getMostPurchasedCategories);

export default router; 