"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = require("../controllers/task");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.post("/", authmiddleware_1.protect, task_1.createTask);
router.get("/", authmiddleware_1.protect, task_1.getTasks);
router.get("/project/:projectId", authmiddleware_1.protect, task_1.getTaskByProject);
router.put("/:id", authmiddleware_1.protect, task_1.getTaskUpdate);
router.delete("/:id", authmiddleware_1.protect, task_1.getTaskDelete);
exports.default = router;
