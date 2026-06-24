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

router.get("/members", protect, getProjectMembers);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProjectById);

router.put("/:id", protect, getProjectUpdate);

router.delete("/:id", protect, getProjectDelete);

export default router;