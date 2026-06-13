"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_1 = require("../controllers/team");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.post("/", authmiddleware_1.protect, team_1.createMember);
router.get("/", authmiddleware_1.protect, team_1.getMembers);
router.put("/:id", authmiddleware_1.protect, team_1.updateMember);
router.delete("/:id", authmiddleware_1.protect, team_1.deleteMember);
exports.default = router;
