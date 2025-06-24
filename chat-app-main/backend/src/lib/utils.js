import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// 🔐 Generate auth token and set in cookie
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

// 🔑 Generate secure reset token
export const generateResetToken = () => {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

// 📧 Send password reset email using Mailtrap
export const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/reset-password/${token}`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Chat App" <no-reply@chatapp.com>',
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to set a new one:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    console.log("📧 Reset email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send reset email:", err);
    throw new Error("Failed to send reset email. Please try again later.");
  }
};
