const Income = require("../models/Income");

const incomeController = {
  // Get all income records
  getAllIncome: async (req, res) => {
    try {
      const income = await Income.getAll();

      res.json({
        success: true,
        message: "Income records retrieved successfully",
        data: {
          income,
          count: income.length,
        },
      });
    } catch (error) {
      console.error("Error getting income records:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve income records",
        error: error.message,
      });
    }
  },

  // Get income by ID
  getIncomeById: async (req, res) => {
    try {
      const { id } = req.params;
      const income = await Income.findById(id);

      if (!income) {
        return res.status(404).json({
          success: false,
          message: "Income record not found",
        });
      }

      res.json({
        success: true,
        message: "Income record retrieved successfully",
        data: {
          income,
        },
      });
    } catch (error) {
      console.error("Error getting income by ID:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve income record",
        error: error.message,
      });
    }
  },

  // Get income by date range
  getIncomeByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Both startDate and endDate are required",
        });
      }

      const income = await Income.getByDateRange(startDate, endDate);
      const total = await Income.getTotalByDateRange(startDate, endDate);

      res.json({
        success: true,
        message: "Income records retrieved successfully",
        data: {
          income,
          count: income.length,
          total: total.TotalIncome || 0,
          dateRange: { startDate, endDate },
        },
      });
    } catch (error) {
      console.error("Error getting income by date range:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve income records",
        error: error.message,
      });
    }
  },

  // Search income records
  searchIncome: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const income = await Income.search(q);

      res.json({
        success: true,
        message: "Search completed successfully",
        data: {
          income,
          count: income.length,
        },
      });
    } catch (error) {
      console.error("Error searching income:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search income records",
        error: error.message,
      });
    }
  },

  // Get daily income summary
  getDailySummary: async (req, res) => {
    try {
      const { date } = req.params;
      const summary = await Income.getDailySummary(date);

      res.json({
        success: true,
        message: "Daily income summary retrieved successfully",
        data: {
          date,
          summary,
        },
      });
    } catch (error) {
      console.error("Error getting daily income summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve daily income summary",
        error: error.message,
      });
    }
  },

  // Get monthly income summary
  getMonthlySummary: async (req, res) => {
    try {
      const { year, month } = req.params;
      const summary = await Income.getMonthlySummary(year, month);

      res.json({
        success: true,
        message: "Monthly income summary retrieved successfully",
        data: {
          year,
          month,
          summary,
        },
      });
    } catch (error) {
      console.error("Error getting monthly income summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve monthly income summary",
        error: error.message,
      });
    }
  },

  // Get income by category
  getIncomeByCategory: async (req, res) => {
    try {
      const categories = await Income.getByCategory();

      res.json({
        success: true,
        message: "Income categories retrieved successfully",
        data: {
          categories,
        },
      });
    } catch (error) {
      console.error("Error getting income by category:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve income categories",
        error: error.message,
      });
    }
  },

  // Create manual income entry
  createIncome: async (req, res) => {
    try {
      const { amount, description, source, date } = req.body;

      // Validation
      if (!amount || !description || !source || !date) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: amount, description, source, date",
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }

      const incomeId = await Income.create({
        amount,
        description,
        source,
        date,
      });
      const income = await Income.findById(incomeId);

      res.status(201).json({
        success: true,
        message: "Income record created successfully",
        data: {
          income,
        },
      });
    } catch (error) {
      console.error("Error creating income:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create income record",
        error: error.message,
      });
    }
  },

  // Update income record
  updateIncome: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updated = await Income.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Income record not found",
        });
      }

      const income = await Income.findById(id);

      res.json({
        success: true,
        message: "Income record updated successfully",
        data: {
          income,
        },
      });
    } catch (error) {
      console.error("Error updating income:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update income record",
        error: error.message,
      });
    }
  },

  // Delete income record
  deleteIncome: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await Income.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Income record not found",
        });
      }

      res.json({
        success: true,
        message: "Income record deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting income:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete income record",
        error: error.message,
      });
    }
  },
};

module.exports = incomeController;
