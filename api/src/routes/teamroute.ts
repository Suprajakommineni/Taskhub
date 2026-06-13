import express from "express";
import {
  createMember,
  getMembers,
  deleteMember,
  updateMember,
} from "../controllers/team";

import { protect } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/", protect, createMember);

router.get("/", protect, getMembers);

router.put("/:id", protect, updateMember);

router.delete("/:id", protect, deleteMember);

export default router;