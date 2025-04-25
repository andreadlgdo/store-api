import express from 'express';
import { getCustomTexts, updateCustomTexts } from '../controllers/customTextsController';

const router = express.Router();

router.get('/', getCustomTexts);
router.get('/:page', getCustomTexts);
router.put('/:page', updateCustomTexts);

export default router;