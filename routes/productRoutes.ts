import express from 'express';

import { getProducts, updateProduct } from '../controllers/productController';


const router = express.Router();

router.get('/', getProducts);
router.put('/:id', updateProduct);

export default router;
