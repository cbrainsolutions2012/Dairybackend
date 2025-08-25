const jwt = require("jsonwebtoken");
const { db } = require("../config/database");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
        status: 401,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const [users] = await db.execute(
      "SELECT Id, Username FROM Users WHERE Id = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
        status: 401,
      });
    }
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
        status: 401,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
        status: 401,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      status: 500,
    });
  }
};

module.exports = auth;
