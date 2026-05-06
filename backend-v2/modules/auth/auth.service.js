import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

class AuthService {
  // 🔥 Register User
  async register(userData) {
    const { username, email, password, ...rest } = userData;

    if (!username || !email || !password) {
      throw new Error("Username, email and password are required");
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      ...rest,
    });

    const token = this.generateToken(newUser._id);

    return {
      user: this.formatUser(newUser),
      token,
    };
  }

  // 🔥 Login User
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const foundUser = await User.findOne({ email }).select("+password");

    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(foundUser._id);

    return {
      user: this.formatUser(foundUser),
      token,
    };
  }

  // 🔐 Generate JWT
  generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  // 🔐 Verify JWT
  async verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }

  // 🎯 Format user response (no sensitive data)
  formatUser(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}

export default new AuthService();
