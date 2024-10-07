import express from 'express';

import { addImage } from '../controllers/imageController';

const router = express.Router();

import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), addImage);

export default router;
