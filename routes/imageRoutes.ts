import express from 'express';

import { addImage, updateImageName } from '../controllers/imageController';

const router = express.Router();

import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), addImage);
router.post('/updated', updateImageName);

export default router;
