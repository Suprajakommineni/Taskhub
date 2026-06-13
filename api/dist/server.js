"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authroute_1 = __importDefault(require("./routes/authroute"));
const projectroute_1 = __importDefault(require("./routes/projectroute"));
const userrouter_1 = __importDefault(require("./routes/userrouter"));
const taskroute_1 = __importDefault(require("./routes/taskroute"));
const dashboardroute_1 = __importDefault(require("./routes/dashboardroute"));
const dueroute_1 = __importDefault(require("./routes/dueroute"));
const teamroute_1 = __importDefault(require("./routes/teamroute"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server running");
});
app.use("/api/auth", authroute_1.default);
app.use("/api/projects", projectroute_1.default);
app.use("/api/users", userrouter_1.default);
app.use("/api", dueroute_1.default);
app.use("/api/tasks", taskroute_1.default);
app.use("/api/dashboard", dashboardroute_1.default);
app.use("/api/team", teamroute_1.default);
app.use((err, req, res, next) => {
    console.error("🔥 GLOBAL ERROR:", err);
    res.status(500).json({ message: "Server crashed", error: err.message });
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
