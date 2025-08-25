const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      // Debug logging
      console.log("req.body:", req.body);
      console.log("req.query:", req.query);

      // Support both body and query parameters
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      // Check username length
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters long",
        });
      }

      // Check password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      // Create user
      const userId = await User.createUser({ username, password });

      // Get created user (without password)
      const newUser = await User.findById(userId);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.message === "Username already exists") {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      // Login user
      const user = await User.login(username, password);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.Id,
          username: user.Username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: user,
          token: token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);

      if (error.message === "Invalid username or password") {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: {
          user: user,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      // Check new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }

      // Get user with password for verification
      const user = await User.findByUsername(req.user.username);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await User.verifyPassword(
        currentPassword,
        user.Password
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      await User.updatePassword(userId, newPassword);

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get all users (admin function)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      const userCount = await User.getUserCount();

      res.json({
        success: true,
        data: {
          users: users,
          total: userCount,
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Delete user (admin function)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Don't allow user to delete themselves
      if (parseInt(id) === req.user.userId) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      await User.deleteUser(id);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = authController;
