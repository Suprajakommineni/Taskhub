import express from "express";
import {
  createTask,
  getTasks,
  getTaskByProject,
  getTaskUpdate,
  getTaskDelete,
} from "../controllers/task";
import { protect } from "../middleware/authmiddleware";

const router = express.Router();

/**
 * TASK ROUTES ONLY
 */

// Create task
router.post("/", protect, createTask);

// Get all tasks of logged-in user
router.get("/", protect, getTasks);

// Get tasks by project
router.get("/project/:projectId", protect, getTaskByProject);

// Update task
router.put("/:id", protect, getTaskUpdate);

// Delete task
router.delete("/:id", protect, getTaskDelete);

export default router;