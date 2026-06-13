"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const currentuser_1 = require("../controllers/currentuser");
const authmiddleware_1 = require("../middleware/authmiddleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/me", authmiddleware_1.protect, currentuser_1.getCurrentUser);
exports.default = router;
