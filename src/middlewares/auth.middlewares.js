import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import asyncHandler from "../utils/asynchandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken || req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message, "Token was:", token);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
};
