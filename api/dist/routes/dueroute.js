"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const due_1 = require("../controllers/due");
const authmiddleware_1 = require("../middleware/authmiddleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/notifications", authmiddleware_1.protect, due_1.getNotifications);
exports.default = router;
