import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import { generateResetToken, sendResetEmail } from "../lib/utils.js";
import bcrypt from "bcryptjs"; // make sure it's installed

const router = express.Router();

// ✅ Signup, Login, Logout
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

// ✅ Forgot Password - Send Reset Email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  console.log("🔐 Forgot password request for:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "Email not found" });
    }

    const token = generateResetToken();
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 3600000;
    await user.save();

    await sendResetEmail(email, token);

    return res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error("❌ Forgot Password Server Error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ✅ Reset Password - via Token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

export default router;
