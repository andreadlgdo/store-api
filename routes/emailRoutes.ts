import express from 'express';
import { emailController } from '../controllers/emailController';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/send',
  [
    body('to').isEmail().withMessage('Valid email address is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('text').optional(),
    body('html').optional(),
    body().custom((body) => {
      if (!body.text && !body.html) {
        throw new Error('Either text or HTML content is required');
      }
      return true;
    }),
  ],
  emailController.sendEmail
);

export default router; 