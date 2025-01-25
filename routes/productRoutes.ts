import express from 'express';

import { addProduct, getProducts, updateProduct } from '../controllers/productController';


const router = express.Router();

router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);

export default router;
