import express from 'express';
import { login, getUser } from '../../js/controllers/user.controller.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.get('/user', getUser);

export default router;
