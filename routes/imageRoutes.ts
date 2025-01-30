import express from 'express';

import { addImage, deleteImageName, updateImageName } from '../controllers/imageController';

const router = express.Router();

import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), addImage);
router.post('/updated', updateImageName);
router.post('/deleted', deleteImageName);

export default router;
