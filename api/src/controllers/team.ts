import { Request, Response } from "express";
import Team from "../models/teammodel";

/**
 * CREATE MEMBER
 */
export const createMember = async (
  req: any,
  res: Response
) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { username, email, role, status } = req.body;

    if (!username || !email || !role) {
      return res.status(400).json({
        message: "Username, Email and Role are required",
      });
    }

    const member = await Team.create({
      username,
      email,
      role,
      status: status || "Available",
      createdBy: req.user.id,
    });

    res.status(201).json(member);
  } catch (error: any) {
    console.error("TEAM CREATE ERROR:", error);

    res.status(500).json({
      message: error.message,
      error
    });
  }
};

/**
 * GET MEMBERS
 */
export const getMembers = async (
  req: any,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const members = await Team.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(members);
  } catch (error: any) {
    console.error("GET MEMBERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message,
    });
  }
};

/**
 * UPDATE MEMBER
 */
export const updateMember = async (
  req: any,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const member = await Team.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      {
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json(member);
  } catch (error: any) {
    console.error("UPDATE MEMBER ERROR:", error);

    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

/**
 * DELETE MEMBER
 */
export const deleteMember = async (
  req: any,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const member = await Team.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json({
      message: "Member deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE MEMBER ERROR:", error);

    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};