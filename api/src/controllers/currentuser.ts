import User from "../models/usermodel"

export const getCurrentUser = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email"
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};