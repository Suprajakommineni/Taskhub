import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "Team Member",
  },

  status: {
    type: String,
    default: "Available",
  },
},
{
  timestamps: true,
}
);
export default mongoose.model("Users",UserSchema)