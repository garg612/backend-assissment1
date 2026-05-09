import User from "../models/user.models.js";
import asyncHandler from "../utils/asynchandler.js";

const generateTokenAndSetCookie = (user, res) => {
  const token = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res.cookie("token", token, options);
  return token;
};

const googleCallback = asyncHandler(async (req, res) => {
  const token = generateTokenAndSetCookie(req.user, res);
  res.redirect(`${process.env.CORS_ORIGIN}/?token=${token}&role=${req.user.role}`);
});

const adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }

  let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // Will be hashed
      role: "admin",
    });
  }

  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "Admin logged in successfully",
      accessToken,
      refreshToken,
      admin,
    });
});




const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export { googleCallback, adminLogin, getMe, refreshAccessToken };