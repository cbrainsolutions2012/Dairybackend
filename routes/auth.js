const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

// Public routes (no authentication required)
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes (authentication required)
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/change-password", authMiddleware, authController.changePassword);

// Admin routes (authentication required)
router.get("/users", authMiddleware, authController.getAllUsers);
router.delete("/users/:id", authMiddleware, authController.deleteUser);

module.exports = router;
