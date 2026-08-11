"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskDelete = exports.getTaskUpdate = exports.getTaskByProject = exports.getTasks = exports.createTask = void 0;
const taskmodel_1 = __importDefault(require("../models/taskmodel"));
const projectmodel_1 = __importDefault(require("../models/projectmodel"));
/**

* CREATE TASK
  */
const createTask = async (req, res) => {
    try {
        const task = await taskmodel_1.default.create({
            ...req.body,
            createdBy: req.user.id,
        });
        await projectmodel_1.default.findByIdAndUpdate(task.project, {
            $inc: { tasks: 1 },
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error("CREATE TASK ERROR:", error);
        res.status(500).json({
            message: "Task creation failed",
            error: error.message,
        });
    }
};
exports.createTask = createTask;
/**

* GET ALL TASKS OF LOGGED IN USER
  */
const getTasks = async (req, res) => {
    try {
        const tasks = await taskmodel_1.default.find({
            createdBy: req.user.id,
        })
            .populate("project", "name")
            .populate("assignedTo", "username");
        console.log(tasks);
        console.log("CURRENT USER:", req.user.id);
        res.json(tasks);
    }
    catch (error) {
        console.error("GET TASKS ERROR:", error);
        res.status(500).json({
            message: "Failed to fetch tasks",
            error: error.message,
        });
    }
};
exports.getTasks = getTasks;
/**

* GET TASKS BY PROJECT
  */
const getTaskByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await taskmodel_1.default.find({
            project: projectId,
            createdBy: req.user.id,
        })
            .populate("project", "name")
            .populate("assignedTo", "username");
        res.json(tasks);
    }
    catch (error) {
        console.error("GET TASK BY PROJECT ERROR:", error);
        res.status(500).json({
            message: "Failed to fetch project tasks",
        });
    }
};
exports.getTaskByProject = getTaskByProject;
/**

* UPDATE TASK
  */
const getTaskUpdate = async (req, res) => {
    try {
        const task = await taskmodel_1.default.findOneAndUpdate({
            _id: req.params.id,
            createdBy: req.user.id,
        }, req.body, {
            new: true,
        });
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        res.json(task);
    }
    catch (error) {
        console.error("UPDATE TASK ERROR:", error);
        res.status(500).json({
            message: "Task update failed",
            error: error.message,
        });
    }
};
exports.getTaskUpdate = getTaskUpdate;
/**

* DELETE TASK
  */
const getTaskDelete = async (req, res) => {
    try {
        const task = await taskmodel_1.default.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        });
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        await taskmodel_1.default.findByIdAndDelete(task._id);
        await projectmodel_1.default.findByIdAndUpdate(task.project, {
            $inc: { tasks: -1 },
        });
        res.json({
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("DELETE TASK ERROR:", error);
        res.status(500).json({
            message: "Delete failed",
            error: error.message,
        });
    }
};
exports.getTaskDelete = getTaskDelete;
