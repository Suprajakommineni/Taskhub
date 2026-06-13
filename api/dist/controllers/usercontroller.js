"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMember = exports.getMembers = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const getMembers = async (req, res) => {
    try {
        const members = await usermodel_1.default.find().select("-password");
        res.json(members);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getMembers = getMembers;
const createMember = async (req, res) => {
    try {
        const member = await usermodel_1.default.create(req.body);
        res.status(201).json(member);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.createMember = createMember;
