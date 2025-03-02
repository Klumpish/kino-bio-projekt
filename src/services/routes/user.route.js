import express from 'express';
import { login, getUser, newLogin, register, current } from '../../js/controllers/user.controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.get('/user', getUser);

router.post('/newLogin', newLogin);
router.post('/register', register);
router.get('/current', auth, current);

export default router;
