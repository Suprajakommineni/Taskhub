import express from "express";
import { getDashboardSummary } from "../controllers/dashboard";
import {protect} from "../middleware/authmiddleware"


const router = express.Router();

router.get("/summary",protect, getDashboardSummary);

export default router;