const MilkDistribution = require("../models/MilkDistribution");
const Seller = require("../models/Seller");

const milkDistributionController = {
  // Create new milk sale
  createMilkSale: async (req, res) => {
    try {
      const { sellerId, milkType, sellerPrice, totalQty, date, fatPercentage } =
        req.body;

      // Validation
      if (
        !sellerId ||
        !milkType ||
        !sellerPrice ||
        !totalQty ||
        !date ||
        !fatPercentage
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required: sellerId, milkType, sellerPrice, totalQty, date, fatPercentage",
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
      if (sellerPrice <= 0 || totalQty <= 0 || fatPercentage <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price, quantity, and fat percentage must be greater than 0",
        });
      }

      // Check if seller exists
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      // Calculate total amount
      const totalAmount = parseFloat(sellerPrice) * parseFloat(totalQty);

      const milkSaleId = await MilkDistribution.createMilkSale({
        sellerId,
        sellerName: seller.FullName,
        milkType,
        sellerPrice: parseFloat(sellerPrice),
        totalQty: parseFloat(totalQty),
        date,
        fatPercentage: parseFloat(fatPercentage),
        totalAmount,
      });

      const newMilkSale = await MilkDistribution.findById(milkSaleId);

      res.status(201).json({
        success: true,
        message: "Milk sale recorded successfully",
        data: {
          milkSale: newMilkSale,
        },
      });
    } catch (error) {
      console.error("Create milk sale error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get all milk sales
  getAllMilkSales: async (req, res) => {
    try {
      const { sellerId, milkType, startDate, endDate, includeDetails } =
        req.query;

      let milkSales;

      if (sellerId) {
        milkSales = await MilkDistribution.getMilkSalesBySeller(sellerId);
      } else if (milkType) {
        milkSales = await MilkDistribution.getMilkSalesByType(milkType);
      } else if (startDate && endDate) {
        milkSales = await MilkDistribution.getMilkSalesByDateRange(
          startDate,
          endDate
        );
      } else if (includeDetails === "true") {
        milkSales = await MilkDistribution.getMilkSalesWithSellerDetails();
      } else {
        milkSales = await MilkDistribution.getAllMilkSales();
      }

      res.json({
        success: true,
        data: {
          milkSales: milkSales,
          total: milkSales.length,
        },
      });
    } catch (error) {
      console.error("Get all milk sales error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get milk sale by ID
  getMilkSaleById: async (req, res) => {
    try {
      const { id } = req.params;

      const milkSale = await MilkDistribution.findById(id);

      if (!milkSale) {
        return res.status(404).json({
          success: false,
          message: "Milk sale record not found",
        });
      }

      res.json({
        success: true,
        data: {
          milkSale: milkSale,
        },
      });
    } catch (error) {
      console.error("Get milk sale by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Update milk sale
  updateMilkSale: async (req, res) => {
    try {
      const { id } = req.params;
      const { sellerId, milkType, sellerPrice, totalQty, date, fatPercentage } =
        req.body;

      // Validation
      if (
        !sellerId ||
        !milkType ||
        !sellerPrice ||
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

      // Check if seller exists
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      // Calculate total amount
      const totalAmount = parseFloat(sellerPrice) * parseFloat(totalQty);

      const updatedMilkSale = await MilkDistribution.updateMilkSale(id, {
        sellerId,
        sellerName: seller.FullName,
        milkType,
        sellerPrice: parseFloat(sellerPrice),
        totalQty: parseFloat(totalQty),
        date,
        fatPercentage: parseFloat(fatPercentage),
        totalAmount,
      });

      res.json({
        success: true,
        message: "Milk sale updated successfully",
        data: {
          milkSale: updatedMilkSale,
        },
      });
    } catch (error) {
      console.error("Update milk sale error:", error);

      if (error.message === "Milk sale record not found") {
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

  // Delete milk sale
  deleteMilkSale: async (req, res) => {
    try {
      const { id } = req.params;

      await MilkDistribution.deleteMilkSale(id);

      res.json({
        success: true,
        message: "Milk sale deleted successfully",
      });
    } catch (error) {
      console.error("Delete milk sale error:", error);

      if (error.message === "Milk sale record not found") {
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

  // Get milk sales summary
  getMilkSalesSummary: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const summary = await MilkDistribution.getMilkSalesSummary(
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
      console.error("Get milk sales summary error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get daily milk sales report
  getDailyMilkSalesReport: async (req, res) => {
    try {
      const { date } = req.params;

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: "Date must be in YYYY-MM-DD format",
        });
      }

      const report = await MilkDistribution.getDailyMilkSalesReport(date);

      res.json({
        success: true,
        data: {
          date: date,
          report: report,
        },
      });
    } catch (error) {
      console.error("Get daily milk sales report error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Search milk sales
  searchMilkSales: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Search term must be at least 2 characters",
        });
      }

      const milkSales = await MilkDistribution.searchMilkSales(q.trim());

      res.json({
        success: true,
        data: {
          milkSales: milkSales,
          total: milkSales.length,
        },
      });
    } catch (error) {
      console.error("Search milk sales error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get profit analysis
  getProfitAnalysis: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const analysis = await MilkDistribution.getProfitAnalysis(
        startDate,
        endDate
      );

      res.json({
        success: true,
        data: {
          analysis: analysis,
          period:
            startDate && endDate ? `${startDate} to ${endDate}` : "All time",
        },
      });
    } catch (error) {
      console.error("Get profit analysis error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = milkDistributionController;
