import express, { Request, Response } from "express";
import { protect } from "../middleware/authmiddleware";
import { upload } from "../config/cloudinary";
import User from "../models/usermodel";
import {
  getCurrentUser,
  getMembers,
  createMember,
  changePassword,           // ← add this
} from "../controllers/usercontroller";
import { removeAvatar } from "../controllers/usercontroller";

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.put("/me/password", protect, changePassword);  // ← add this

router.post(
  "/me/avatar",
  protect,
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    const file = (req as any).file;

    try {
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = (req as any).user.id;

      const user = await User.findByIdAndUpdate(
        userId,
        { avatarUrl: file.path },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ avatarUrl: user.avatarUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

router.post(
  "/me/avatar/remove",
  protect,
  removeAvatar
);
export default router;