import express from "express";
import {
  login,
  register,
} from "../controllers/auth";
import transporter from "../config/mailer";

// test route — remove after confirming


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/test-email", async (req, res) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "youremail@gmail.com",
    subject: "TaskHub Test",
    text: "Nodemailer is working!",
  });
  res.json({ message: "Email sent" });
});

export default router;