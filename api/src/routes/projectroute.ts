import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectUpdate,
  getProjectDelete,
  getProjectMembers,
} from "../controllers/project";

import { protect } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, getProjectUpdate);
router.delete("/:id", protect, getProjectDelete);

// ✅ THIS IS THE ONLY VALID MEMBERS ROUTE
router.get("/:projectId/members", protect, getProjectMembers);

export default router;