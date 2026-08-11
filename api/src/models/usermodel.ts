import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatarUrl: { type: String, default: "" },

    notificationPreferences: {
      emailNotifications:   { type: Boolean, default: true },
      taskNotifications:    { type: Boolean, default: true },
      projectNotifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);