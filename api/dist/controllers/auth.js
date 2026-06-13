"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usermodel_1 = __importDefault(require("../models/usermodel"));
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await usermodel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists",
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await usermodel_1.default.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usermodel_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({
                message: "Invalid Credentials",
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                message: "Invalid Credentials",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.login = login;
