import express from 'express';

import { getFavouriteRecommendationsByUserId, getTopCategoriesByUserId } from '../controllers/recommendationController';

const router = express.Router();

router.get('/orders/:userId', getTopCategoriesByUserId);
router.get('/favourites/:userId', getFavouriteRecommendationsByUserId);

export default router;
