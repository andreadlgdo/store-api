import express from 'express';

import { getCategoriesImages } from "../controllers/categoryController";

const router = express.Router();

router.get('/', getCategoriesImages);

export default router;
