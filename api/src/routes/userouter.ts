import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controllers/notify";
import express from "express";
import { protect } from "../middleware/authmiddleware";

// ... your existing user routes ...
const router = express.Router()
router.get("/me/notification-preferences", protect, getNotificationPreferences);
router.put("/me/notification-preferences", protect, updateNotificationPreferences);

export default router;