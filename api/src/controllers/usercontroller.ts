import User from "../models/usermodel";
import {Request ,Response} from "express"

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
};