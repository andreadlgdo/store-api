import express from 'express';
import { getMostViewedProducts } from '../controllers/analyticsController';

const router = express.Router();

router.get('/topProducts', getMostViewedProducts);

export default router; 