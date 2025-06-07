import express from 'express';

import { getFavouriteRecommendationsByUserId, getTopCategoriesByUserId, getMostViewedCategoriesByUserId } from '../controllers/recommendationController';

const router = express.Router();

router.get('/orders/:userId', getTopCategoriesByUserId);
router.get('/favourites/:userId', getFavouriteRecommendationsByUserId);
router.get('/productViews/:userId', getMostViewedCategoriesByUserId);

export default router;
