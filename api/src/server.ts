import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authroutes from "./routes/authroute";
import projectroutes from "./routes/projectroute";
import userroutes from "./routes/userrouter";
import taskroutes from "./routes/taskroute";
import dashboardroutes from "./routes/dashboardroute"
import {Request, Response, NextFunction} from "express";
import dueroutes from "./routes/dueroute";
import teamroutes from "./routes/teamroute";


dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});
app.use("/api/auth", authroutes);
app.use("/api/projects", projectroutes);
app.use("/api/users",userroutes);
app.use("/api", dueroutes);
app.use("/api/tasks",taskroutes);
app.use("/api/dashboard",dashboardroutes);
app.use("/api/team", teamroutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({ message: "Server crashed", error: err.message });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});