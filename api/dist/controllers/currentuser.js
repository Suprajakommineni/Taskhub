"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const getCurrentUser = async (req, res) => {
    try {
        const user = await usermodel_1.default.findById(req.user.id).select("username email");
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
        });
    }
};
exports.getCurrentUser = getCurrentUser;
