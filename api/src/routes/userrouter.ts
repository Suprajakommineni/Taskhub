import { getCurrentUser } from "../controllers/currentuser";
import { protect } from "../middleware/authmiddleware";
import express from "express";

const router = express.Router();
router.get("/me", protect, getCurrentUser);

export default router;