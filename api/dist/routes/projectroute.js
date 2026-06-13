"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../controllers/project");
const authmiddleware_1 = require("../middleware/authmiddleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/", authmiddleware_1.protect, project_1.createProject);
router.get("/", authmiddleware_1.protect, project_1.getProjects);
router.get("/members", authmiddleware_1.protect, project_1.getProjectMembers);
router.get("/:id", authmiddleware_1.protect, project_1.getProjectById);
router.put("/:id", authmiddleware_1.protect, project_1.getProjectUpdate);
router.delete("/:id", authmiddleware_1.protect, project_1.getProjectDelete);
exports.default = router;
