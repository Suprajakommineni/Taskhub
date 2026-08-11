"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectMembers = exports.getProjectById = exports.getProjectDelete = exports.getProjectUpdate = exports.getProjects = exports.createProject = void 0;
const projectmodel_1 = __importDefault(require("../models/projectmodel"));
const taskmodel_1 = __importDefault(require("../models/taskmodel"));
const createProject = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const project = await projectmodel_1.default.create({
            ...req.body,
            createdBy: userId,
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Create project failed",
            error: error.message,
        });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const projects = await projectmodel_1.default.find({
            createdBy: userId,
        });
        // attach real task count
        const projectsWithTaskCount = await Promise.all(projects.map(async (project) => {
            const taskCount = await taskmodel_1.default.countDocuments({
                project: project._id,
            });
            return {
                ...project.toObject(),
                tasks: taskCount,
            };
        }));
        res.json(projectsWithTaskCount);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch projects",
        });
    }
};
exports.getProjects = getProjects;
const getProjectUpdate = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const project = await projectmodel_1.default.findOneAndUpdate({ _id: req.params.id, createdBy: userId }, req.body, { new: true });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Project update failed",
            error: error.message,
        });
    }
};
exports.getProjectUpdate = getProjectUpdate;
const getProjectDelete = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const project = await projectmodel_1.default.findOneAndDelete({
            _id: req.params.id,
            createdBy: userId,
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Project delete failed",
            error: error.message,
        });
    }
};
exports.getProjectDelete = getProjectDelete;
const getProjectById = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const project = await projectmodel_1.default.findOne({
            _id: req.params.id,
            createdBy: userId,
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching project",
            error: error.message,
        });
    }
};
exports.getProjectById = getProjectById;
const getProjectMembers = async (req, res) => {
    try {
        console.log("🔥 /members ROUTE HIT");
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - no userId" });
        }
        // ✅ lean() prevents mongoose weird objects
        const projects = await projectmodel_1.default.find({ createdBy: userId }).lean();
        console.log("PROJECTS FOUND:", projects.length);
        // ✅ SAFE extraction (no forEach crash risk)
        const members = projects.flatMap((p) => p.members ?? []);
        // remove duplicates
        const uniqueMembers = [...new Set(members)];
        return res.json(uniqueMembers);
    }
    catch (error) {
        console.error("🔥 MEMBERS ERROR:", error);
        return res.status(500).json({
            message: "Server error",
            error: error?.message,
        });
    }
};
exports.getProjectMembers = getProjectMembers;
