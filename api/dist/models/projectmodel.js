"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Running", "Completed"],
        default: "Pending",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    progress: {
        type: Number,
        default: 0,
    },
    tasks: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dueDate: {
        type: Date,
    },
    members: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Project", projectSchema);
