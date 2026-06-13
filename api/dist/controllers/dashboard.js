"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const taskmodel_1 = __importDefault(require("../models/taskmodel"));
const projectmodel_1 = __importDefault(require("../models/projectmodel"));
const usersmodel_1 = __importDefault(require("../models/usersmodel"));
const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const totalProjects = await projectmodel_1.default.countDocuments({ createdBy: userId });
        const totalTasks = await taskmodel_1.default.countDocuments({ createdBy: userId });
        const completedTasks = await taskmodel_1.default.countDocuments({
            createdBy: userId,
            status: "Completed",
        });
        const pendingTasks = await taskmodel_1.default.countDocuments({
            createdBy: userId,
            status: "Pending",
        });
        // STEP 1: get assigned user IDs safely
        const tasks = await taskmodel_1.default.find({
            createdBy: userId,
            assignedTo: { $ne: null },
        }).select("assignedTo");
        const memberIds = tasks.map((t) => t.assignedTo);
        // STEP 2: get usernames
        const users = await usersmodel_1.default.find({
            _id: { $in: memberIds },
        }).select("username");
        const usernames = users.map((u) => u.username);
        res.json({
            totalProjects,
            totalTasks,
            completedTasks,
            pendingTasks,
            teamMembers: usernames, // ✅ ONLY USERNAMES
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getDashboardSummary = getDashboardSummary;
