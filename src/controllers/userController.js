import User from "../models/user.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, email, role } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    if (role) {
      if (user.role === "STUDENT" && role === "INSTRUCTOR") {
        user.role = "INSTRUCTOR";
      }

      if (user.role === "INSTRUCTOR" && role === "STUDENT") {
        return res.status(403).json({
          message: "Instructor cannot switch back to Student",
        });
      }
    }

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file, "users");
      user.profilePic = uploaded.secure_url;
    }

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("name email profilePic");

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
