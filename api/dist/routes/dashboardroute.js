"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_1 = require("../controllers/dashboard");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.get("/summary", authmiddleware_1.protect, dashboard_1.getDashboardSummary);
exports.default = router;
