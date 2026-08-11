import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import authroutes from "./routes/authroute";
import projectroutes from "./routes/projectroute";
import userroutes from "./routes/userrouter";
import taskroutes from "./routes/taskroute";
import dashboardroutes from "./routes/dashboardroute"
import {Request, Response, NextFunction} from "express";
import dueroutes from "./routes/dueroute";
import userouter from "./routes/userouter";
import { startCronJobs } from "./config/cronJobs";



console.log("Cloudinary cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
connectDB();
startCronJobs(); 
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskhub-frontend-two.vercel.app",
    ],
    credentials: true,
  })
);
// Profile photos are currently sent as Base64 strings. They are larger than
// the original files, so 5 MB is not enough for a project with several members.
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.get("/", (req, res) => {
  res.send("Server running");
});
app.use("/api/auth", authroutes);
app.use("/api/projects", projectroutes);
app.use("/api/users",userroutes);
app.use("/api/users",userouter);
app.use("/api", dueroutes);
app.use("/api/tasks",taskroutes);
app.use("/api/dashboard",dashboardroutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({ message: "Server crashed", error: err.message });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
