"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const taskmodel_1 = __importDefault(require("../models/taskmodel"));
const getNotifications = async (req, res) => {
    try {
        console.log("USER:", req.user.id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);
        next7Days.setHours(23, 59, 59, 999);
        console.log("TODAY:", today);
        console.log("NEXT:", next7Days);
        const tasks = await taskmodel_1.default.find({
            createdBy: req.user.id,
            dueDate: {
                $gte: today,
                $lte: next7Days,
            },
            status: { $ne: "Completed" },
        });
        console.log("FOUND TASKS:", tasks);
        res.json(tasks);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch notifications",
        });
    }
};
exports.getNotifications = getNotifications;
