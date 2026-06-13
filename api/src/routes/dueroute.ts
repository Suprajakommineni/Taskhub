import { getNotifications } from "../controllers/due";
import { protect } from "../middleware/authmiddleware";
import express from "express";

const router = express.Router();

router.get("/notifications", protect, getNotifications);

export default router;