import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMembers,
  uploadProjectMemberAvatar,
} from "../controllers/project";
import { protect } from "../middleware/authmiddleware";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/members", protect, getProjectMembers);
router.post(
  "/member-avatar",
  protect,
  upload.single("avatar"),
  uploadProjectMemberAvatar
);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
