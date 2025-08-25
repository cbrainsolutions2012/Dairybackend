const bcrypt = require("bcryptjs");
const { db } = require("../config/database");

const User = {
  // Find user by ID (without password)
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT Id, Username, CreatedAt FROM Users WHERE Id = ?",
      [id]
    );
    return rows[0];
  },

  // Find user by username (with password for login)
  findByUsername: async (username) => {
    const [rows] = await db.execute("SELECT * FROM Users WHERE Username = ?", [
      username,
    ]);
    return rows[0];
  },

  // Create new user (Register)
  createUser: async ({ username, password }) => {
    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await db.execute(
      "INSERT INTO Users (Username, Password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    return result.insertId;
  },

  // Verify password for login
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Login method
  login: async (username, password) => {
    // Find user with password
    const user = await User.findByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.Password);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    // Return user without password
    const { Password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Update password
  updatePassword: async (id, newPassword) => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.execute("UPDATE Users SET Password = ? WHERE Id = ?", [
      hashedPassword,
      id,
    ]);
  },

  // Get all users (admin function)
  getAllUsers: async () => {
    const [rows] = await db.execute(
      "SELECT Id, Username, CreatedAt FROM Users ORDER BY CreatedAt DESC"
    );
    return rows;
  },

  // Check if username exists
  usernameExists: async (username, excludeId = null) => {
    let query = "SELECT COUNT(*) as count FROM Users WHERE Username = ?";
    let params = [username];

    if (excludeId) {
      query += " AND Id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].count > 0;
  },

  // Delete user (admin function)
  deleteUser: async (id) => {
    const [result] = await db.execute("DELETE FROM Users WHERE Id = ?", [id]);

    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }

    return true;
  },

  // Get user count
  getUserCount: async () => {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM Users");
    return rows[0].count;
  },
};

module.exports = User;
