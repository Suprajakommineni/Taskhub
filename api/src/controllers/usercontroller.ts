import User from "../models/usermodel";
import {Request ,Response} from "express"
import bcrypt from "bcryptjs";

// PUT /api/users/me/password
export const changePassword = async (req: any, res: any) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update password." });
  }
};
export const getMembers = async (req:Request, res:Response) => {
  try {
    const members = await User.find().select("-password");
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createMember = async (req:Request, res:Response) => {
  try {
    const member = await User.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const removeAvatar = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Remove avatar
    user.avatarUrl = "";

    await user.save();

    res.json({
      message: "Avatar removed successfully",
      avatarUrl: "",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to remove avatar",
    });
  }
};