import express from 'express';

import { addUser, getUsers, updateUser } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.put('/:id', updateUser);

export default router;
