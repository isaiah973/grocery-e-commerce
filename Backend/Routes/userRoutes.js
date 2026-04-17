const express = require("express");

const {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} = require("../Controllers/userController");

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/verify-email", verifyEmail);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);
userRoutes.post("/resend-verification-code", resendVerificationCode);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password", resetPassword);

module.exports = userRoutes;
