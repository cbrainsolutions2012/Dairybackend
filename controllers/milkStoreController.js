const MilkStore = require("../models/MilkStore");
const Buyer = require("../models/Buyer");

const milkStoreController = {
  // Create new milk purchase
  createMilkPurchase: async (req, res) => {
    try {
      const { buyerId, milkType, buyerPrice, totalQty, date, fatPercentage } =
        req.body;

      // Validation
      if (
        !buyerId ||
        !milkType ||
        !buyerPrice ||
        !totalQty ||
        !date ||
        !fatPercentage
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required: buyerId, milkType, buyerPrice, totalQty, date, fatPercentage",
        });
      }

      // Validate milk type
      if (!["cow", "buffalo"].includes(milkType)) {
        return res.status(400).json({
          success: false,
          message: "Milk type must be 'cow' or 'buffalo'",
        });
      }

      // Validate numeric fields
      if (buyerPrice <= 0 || totalQty <= 0 || fatPercentage <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price, quantity, and fat percentage must be greater than 0",
        });
      }

      // Check if buyer exists
      const buyer = await Buyer.findById(buyerId);
      if (!buyer) {
        return res.status(404).json({
          success: false,
          message: "Buyer not found",
        });
      }

      // Calculate total amount
      const totalAmount = parseFloat(buyerPrice) * parseFloat(totalQty);

      const milkPurchaseId = await MilkStore.createMilkPurchase({
        buyerId,
        buyerName: buyer.FullName,
        milkType,
        buyerPrice: parseFloat(buyerPrice),
        totalQty: parseFloat(totalQty),
        date,
        fatPercentage: parseFloat(fatPercentage),
        totalAmount,
      });

      const newMilkPurchase = await MilkStore.findById(milkPurchaseId);

      res.status(201).json({
        success: true,
        message: "Milk purchase recorded successfully",
        data: {
          milkPurchase: newMilkPurchase,
        },
      });
    } catch (error) {
      console.error("Create milk purchase error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get all milk purchases
  getAllMilkPurchases: async (req, res) => {
    try {
      const { buyerId, milkType, startDate, endDate, includeDetails } =
        req.query;

      let milkPurchases;

      if (buyerId) {
        milkPurchases = await MilkStore.getMilkPurchasesByBuyer(buyerId);
      } else if (milkType) {
        milkPurchases = await MilkStore.getMilkPurchasesByType(milkType);
      } else if (startDate && endDate) {
        milkPurchases = await MilkStore.getMilkPurchasesByDateRange(
          startDate,
          endDate
        );
      } else if (includeDetails === "true") {
        milkPurchases = await MilkStore.getMilkPurchasesWithBuyerDetails();
      } else {
        milkPurchases = await MilkStore.getAllMilkPurchases();
      }

      res.json({
        success: true,
        data: {
          milkPurchases: milkPurchases,
          total: milkPurchases.length,
        },
      });
    } catch (error) {
      console.error("Get all milk purchases error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get milk purchase by ID
  getMilkPurchaseById: async (req, res) => {
    try {
      const { id } = req.params;

      const milkPurchase = await MilkStore.findById(id);

      if (!milkPurchase) {
        return res.status(404).json({
          success: false,
          message: "Milk purchase record not found",
        });
      }

      res.json({
        success: true,
        data: {
          milkPurchase: milkPurchase,
        },
      });
    } catch (error) {
      console.error("Get milk purchase by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Update milk purchase
  updateMilkPurchase: async (req, res) => {
    try {
      const { id } = req.params;
      const { buyerId, milkType, buyerPrice, totalQty, date, fatPercentage } =
        req.body;

      // Validation
      if (
        !buyerId ||
        !milkType ||
        !buyerPrice ||
        !totalQty ||
        !date ||
        !fatPercentage
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Validate milk type
      if (!["cow", "buffalo"].includes(milkType)) {
        return res.status(400).json({
          success: false,
          message: "Milk type must be 'cow' or 'buffalo'",
        });
      }

      // Check if buyer exists
      const buyer = await Buyer.findById(buyerId);
      if (!buyer) {
        return res.status(404).json({
          success: false,
          message: "Buyer not found",
        });
      }

      // Calculate total amount
      const totalAmount = parseFloat(buyerPrice) * parseFloat(totalQty);

      const updatedMilkPurchase = await MilkStore.updateMilkPurchase(id, {
        buyerId,
        buyerName: buyer.FullName,
        milkType,
        buyerPrice: parseFloat(buyerPrice),
        totalQty: parseFloat(totalQty),
        date,
        fatPercentage: parseFloat(fatPercentage),
        totalAmount,
      });

      res.json({
        success: true,
        message: "Milk purchase updated successfully",
        data: {
          milkPurchase: updatedMilkPurchase,
        },
      });
    } catch (error) {
      console.error("Update milk purchase error:", error);

      if (error.message === "Milk purchase record not found") {
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

  // Delete milk purchase
  deleteMilkPurchase: async (req, res) => {
    try {
      const { id } = req.params;

      await MilkStore.deleteMilkPurchase(id);

      res.json({
        success: true,
        message: "Milk purchase deleted successfully",
      });
    } catch (error) {
      console.error("Delete milk purchase error:", error);

      if (error.message === "Milk purchase record not found") {
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

  // Get milk purchase summary
  getMilkPurchaseSummary: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const summary = await MilkStore.getMilkPurchaseSummary(
        startDate,
        endDate
      );

      res.json({
        success: true,
        data: {
          summary: summary,
        },
      });
    } catch (error) {
      console.error("Get milk purchase summary error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get daily milk report
  getDailyMilkReport: async (req, res) => {
    try {
      const { date } = req.params;

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: "Date must be in YYYY-MM-DD format",
        });
      }

      const report = await MilkStore.getDailyMilkReport(date);

      res.json({
        success: true,
        data: {
          date: date,
          report: report,
        },
      });
    } catch (error) {
      console.error("Get daily milk report error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Search milk purchases
  searchMilkPurchases: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Search term must be at least 2 characters",
        });
      }

      const milkPurchases = await MilkStore.searchMilkPurchases(q.trim());

      res.json({
        success: true,
        data: {
          milkPurchases: milkPurchases,
          total: milkPurchases.length,
        },
      });
    } catch (error) {
      console.error("Search milk purchases error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = milkStoreController;
