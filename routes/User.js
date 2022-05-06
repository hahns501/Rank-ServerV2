import express from 'express';

import { loginUser, deleteUser, refreshToken, logoutUser, testUser, createUser, getAllUsers} from "../controllers/User.js";
import {Verify} from '../middleware/Verify.js';

const router = express.Router();

router.delete('/:userId', Verify, deleteUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', Verify, logoutUser);
router.post('/test', Verify, testUser);
router.post('/register', createUser);

// verify
router.get('/', getAllUsers);


export default router