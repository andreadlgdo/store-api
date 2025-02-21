import express from 'express';

import { addAddress, deleteAddress, getAddresses, updateAddress } from '../controllers/addressController';

const router = express.Router();

router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
