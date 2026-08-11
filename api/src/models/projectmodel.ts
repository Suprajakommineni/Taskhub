import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const projectSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
    },

    members: {
      type: [teamMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);