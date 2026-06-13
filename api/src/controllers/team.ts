import { Request, Response } from "express";
import Team from "../models/teammodel";

export const createMember = async (
  req: any,
  res: Response
) => {
  try {
    const member = await Team.create({
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      status: req.body.status,
      createdBy: req.user.id,
    });

    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to create member",
      error: error.message,
    });
  }
};

export const getMembers = async (
  req: any,
  res: Response
) => {
  try {
    const members = await Team.find({
      createdBy: req.user.id,
    });

    res.json(members);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message,
    });
  }
};

export const deleteMember = async (
  req: any,
  res: Response
) => {
  try {
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
      message: "Member deleted",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

export const updateMember = async (
  req: any,
  res: Response
) => {
  try {
    const member = await Team.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json(member);
  } catch (error: any) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};