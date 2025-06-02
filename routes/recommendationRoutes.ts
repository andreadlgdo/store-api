import express from 'express';

import { getTopCategoriesByUserId } from '../controllers/recommendationController';

const router = express.Router();

router.get('/:userId', getTopCategoriesByUserId);

export default router;
