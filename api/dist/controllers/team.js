"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMember = exports.deleteMember = exports.getMembers = exports.createMember = void 0;
const teammodel_1 = __importDefault(require("../models/teammodel"));
const createMember = async (req, res) => {
    try {
        const member = await teammodel_1.default.create({
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            status: req.body.status,
            createdBy: req.user.id,
        });
        res.status(201).json(member);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to create member",
            error: error.message,
        });
    }
};
exports.createMember = createMember;
const getMembers = async (req, res) => {
    try {
        const members = await teammodel_1.default.find({
            createdBy: req.user.id,
        });
        res.json(members);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch members",
            error: error.message,
        });
    }
};
exports.getMembers = getMembers;
const deleteMember = async (req, res) => {
    try {
        const member = await teammodel_1.default.findOneAndDelete({
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
    }
    catch (error) {
        res.status(500).json({
            message: "Delete failed",
            error: error.message,
        });
    }
};
exports.deleteMember = deleteMember;
const updateMember = async (req, res) => {
    try {
        const member = await teammodel_1.default.findOneAndUpdate({
            _id: req.params.id,
            createdBy: req.user.id,
        }, req.body, {
            new: true,
        });
        if (!member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }
        res.json(member);
    }
    catch (error) {
        res.status(500).json({
            message: "Update failed",
            error: error.message,
        });
    }
};
exports.updateMember = updateMember;
