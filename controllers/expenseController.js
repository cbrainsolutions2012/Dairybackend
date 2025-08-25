const Expense = require("../models/Expense");

const expenseController = {
  // Get all expense records
  getAllExpenses: async (req, res) => {
    try {
      const expenses = await Expense.getAll();

      res.json({
        success: true,
        message: "Expense records retrieved successfully",
        data: {
          expenses,
          count: expenses.length,
        },
      });
    } catch (error) {
      console.error("Error getting expense records:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expense records",
        error: error.message,
      });
    }
  },

  // Get expense by ID
  getExpenseById: async (req, res) => {
    try {
      const { id } = req.params;
      const expense = await Expense.findById(id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense record not found",
        });
      }

      res.json({
        success: true,
        message: "Expense record retrieved successfully",
        data: {
          expense,
        },
      });
    } catch (error) {
      console.error("Error getting expense by ID:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expense record",
        error: error.message,
      });
    }
  },

  // Get expense by date range
  getExpenseByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Both startDate and endDate are required",
        });
      }

      const expenses = await Expense.getByDateRange(startDate, endDate);
      const total = await Expense.getTotalByDateRange(startDate, endDate);

      res.json({
        success: true,
        message: "Expense records retrieved successfully",
        data: {
          expenses,
          count: expenses.length,
          total: total.TotalExpense || 0,
          dateRange: { startDate, endDate },
        },
      });
    } catch (error) {
      console.error("Error getting expense by date range:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expense records",
        error: error.message,
      });
    }
  },

  // Get expense by category
  getExpenseByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const expenses = await Expense.getByCategory(category);

      res.json({
        success: true,
        message: "Expense records retrieved successfully",
        data: {
          expenses,
          count: expenses.length,
          category,
        },
      });
    } catch (error) {
      console.error("Error getting expense by category:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expense records",
        error: error.message,
      });
    }
  },

  // Search expense records
  searchExpenses: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const expenses = await Expense.search(q);

      res.json({
        success: true,
        message: "Search completed successfully",
        data: {
          expenses,
          count: expenses.length,
        },
      });
    } catch (error) {
      console.error("Error searching expenses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search expense records",
        error: error.message,
      });
    }
  },

  // Get daily expense summary
  getDailySummary: async (req, res) => {
    try {
      const { date } = req.params;
      const summary = await Expense.getDailySummary(date);

      res.json({
        success: true,
        message: "Daily expense summary retrieved successfully",
        data: {
          date,
          summary,
        },
      });
    } catch (error) {
      console.error("Error getting daily expense summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve daily expense summary",
        error: error.message,
      });
    }
  },

  // Get monthly expense summary
  getMonthlySummary: async (req, res) => {
    try {
      const { year, month } = req.params;
      const summary = await Expense.getMonthlySummary(year, month);

      res.json({
        success: true,
        message: "Monthly expense summary retrieved successfully",
        data: {
          year,
          month,
          summary,
        },
      });
    } catch (error) {
      console.error("Error getting monthly expense summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve monthly expense summary",
        error: error.message,
      });
    }
  },

  // Get expense category summary
  getCategorySummary: async (req, res) => {
    try {
      const categories = await Expense.getCategorySummary();

      res.json({
        success: true,
        message: "Expense categories retrieved successfully",
        data: {
          categories,
        },
      });
    } catch (error) {
      console.error("Error getting expense categories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expense categories",
        error: error.message,
      });
    }
  },

  // Get expense breakdown
  getExpenseBreakdown: async (req, res) => {
    try {
      const breakdown = await Expense.getExpenseBreakdown();

      res.json({
        success: true,
        message: "Expense breakdown retrieved successfully",
        data: {
          breakdown,
        },
      });
    } catch (error) {
      console.error("Error getting expense breakdown:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expense breakdown",
        error: error.message,
      });
    }
  },

  // Create manual expense entry
  createExpense: async (req, res) => {
    try {
      const { amount, description, paidTo, category, date } = req.body;

      // Validation
      if (!amount || !description || !paidTo || !date) {
        return res.status(400).json({
          success: false,
          message: "Required fields: amount, description, paidTo, date",
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }

      const expenseId = await Expense.create({
        amount,
        description,
        paidTo,
        category,
        date,
      });
      const expense = await Expense.findById(expenseId);

      res.status(201).json({
        success: true,
        message: "Expense record created successfully",
        data: {
          expense,
        },
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create expense record",
        error: error.message,
      });
    }
  },

  // Update expense record
  updateExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updated = await Expense.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Expense record not found",
        });
      }

      const expense = await Expense.findById(id);

      res.json({
        success: true,
        message: "Expense record updated successfully",
        data: {
          expense,
        },
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update expense record",
        error: error.message,
      });
    }
  },

  // Delete expense record
  deleteExpense: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await Expense.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Expense record not found",
        });
      }

      res.json({
        success: true,
        message: "Expense record deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete expense record",
        error: error.message,
      });
    }
  },
};

module.exports = expenseController;
