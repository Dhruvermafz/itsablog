import authService from "./auth.service.js";
import User from "../../models/user.js";
class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        success: true,
        message: "Login successful",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  // Optional: Get Current User (Protected)
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select("-password").lean();

      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
