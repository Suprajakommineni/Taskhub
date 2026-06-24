import express from "express";
import {
  createTask,
  getTasks,
  getTaskByProject,
  getTaskUpdate,
  getTaskDelete, getProjectMembers
} from "../controllers/task";
import { protect } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/",protect, createTask);

router.get("/",protect, getTasks);


router.get("/project/:projectId", protect, getTaskByProject);

router.put("/:id",protect, getTaskUpdate);

router.delete("/:id",protect, getTaskDelete);
router.get("/:projectId/members", protect, getProjectMembers);

export default router;