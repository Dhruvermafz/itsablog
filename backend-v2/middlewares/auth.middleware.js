import userModel from "../models/user.js"; // ← renamed import to avoid conflict
import authService from "../modules/auth/auth.service.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = await authService.verifyToken(token);

    // Use userModel instead of user
    const currentUser = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = currentUser; // Attach user to request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// Admin middleware
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};
