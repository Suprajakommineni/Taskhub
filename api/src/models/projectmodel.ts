import mongoose from "mongoose";

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

    members: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);