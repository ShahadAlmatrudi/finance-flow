const User = require("../models/User");

exports.getMe = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

exports.updateMe = async (req, res) => {
  try {
    const { fullname, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullname, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Account updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update account.",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profile: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { settings: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Settings updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update settings.",
      error: error.message,
    });
  }
};