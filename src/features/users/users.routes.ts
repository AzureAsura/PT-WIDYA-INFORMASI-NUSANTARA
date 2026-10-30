import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { getProfile } from './users.controller.js';

const router = Router();

router.get('/profile', authenticate, getProfile);

export default router;
