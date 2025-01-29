import express from 'express';
import { getAllUsers, getMe, login, logout, signup, update } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users",protectRoute, getAllUsers);
router.put("/update",protectRoute, update);

export default router;