import express from 'express';

import {
    addProduct,
    deleteProduct,
    findProductByUserId,
    findProductsByIds,
    getProducts,
    updateProduct
} from '../controllers/productController';


const router = express.Router();

router.get('/', getProducts);
router.get('/:ids', findProductsByIds);
router.get('/user/:userId', findProductByUserId);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
