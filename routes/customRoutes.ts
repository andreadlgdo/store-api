import express from 'express';
import { getCustom, updateCustom } from '../controllers/customController';

const router = express.Router();

router.get('/', getCustom);
router.get('/:page', getCustom);
router.put('/:page', updateCustom);

export default router;