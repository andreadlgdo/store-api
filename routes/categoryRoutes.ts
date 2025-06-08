import express from 'express';

import { getCategories, getCategoriesById } from "../controllers/categoryController";

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoriesById);

export default router;
