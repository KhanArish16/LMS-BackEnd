import User from "../models/user.js";

export const updateProfilePic = async (req, res) => {
  try {
    const { url } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: url },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
