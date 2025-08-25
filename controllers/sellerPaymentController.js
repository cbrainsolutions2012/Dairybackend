const SellerPayment = require("../models/SellerPayment");
const Seller = require("../models/Seller");

const sellerPaymentController = {
  // Create new seller payment
  createPayment: async (req, res) => {
    try {
      const {
        sellerId,
        paymentAmount,
        paymentType,
        paymentMethod,
        transactionId,
        notes,
        date,
      } = req.body;

      // Validation
      if (
        !sellerId ||
        !paymentAmount ||
        !paymentType ||
        !paymentMethod ||
        !date
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Required fields: sellerId, paymentAmount, paymentType, paymentMethod, date",
        });
      }

      // Validate payment type
      if (!["advance", "full", "partial"].includes(paymentType)) {
        return res.status(400).json({
          success: false,
          message: "Payment type must be 'advance', 'full', or 'partial'",
        });
      }

      // Validate payment method
      if (!["cash", "bank_transfer", "upi", "cheque"].includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message:
            "Payment method must be 'cash', 'bank_transfer', 'upi', or 'cheque'",
        });
      }

      // Validate payment amount
      if (paymentAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Payment amount must be greater than 0",
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

      // Create payment record (this will trigger seller_payment_expense)
      const paymentId = await SellerPayment.create({
        sellerId,
        sellerName: seller.Name,
        paymentAmount,
        paymentType,
        paymentMethod,
        transactionId: transactionId || null,
        notes: notes || null,
        date,
      });

      // Get the created payment
      const payment = await SellerPayment.findById(paymentId);

      res.status(201).json({
        success: true,
        message: "Seller payment recorded successfully",
        data: {
          payment,
        },
      });
    } catch (error) {
      console.error("Error creating seller payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record seller payment",
        error: error.message,
      });
    }
  },

  // Get all seller payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await SellerPayment.getAll();

      res.json({
        success: true,
        message: "Seller payments retrieved successfully",
        data: {
          payments,
          count: payments.length,
        },
      });
    } catch (error) {
      console.error("Error getting seller payments:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve seller payments",
        error: error.message,
      });
    }
  },

  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await SellerPayment.findById(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({
        success: true,
        message: "Payment retrieved successfully",
        data: {
          payment,
        },
      });
    } catch (error) {
      console.error("Error getting payment by ID:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve payment",
        error: error.message,
      });
    }
  },

  // Get payments by seller
  getPaymentsBySeller: async (req, res) => {
    try {
      const { sellerId } = req.params;
      const payments = await SellerPayment.getBySellerId(sellerId);

      res.json({
        success: true,
        message: "Seller payments retrieved successfully",
        data: {
          payments,
          count: payments.length,
        },
      });
    } catch (error) {
      console.error("Error getting payments by seller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve seller payments",
        error: error.message,
      });
    }
  },

  // Update payment
  updatePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated
      delete updateData.Id;
      delete updateData.CreatedAt;
      delete updateData.IsDeleted;

      const updated = await SellerPayment.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      const payment = await SellerPayment.findById(id);

      res.json({
        success: true,
        message: "Payment updated successfully",
        data: {
          payment,
        },
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update payment",
        error: error.message,
      });
    }
  },

  // Delete payment
  deletePayment: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await SellerPayment.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({
        success: true,
        message: "Payment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete payment",
        error: error.message,
      });
    }
  },

  // Search payments
  searchPayments: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const payments = await SellerPayment.search(q);

      res.json({
        success: true,
        message: "Search completed successfully",
        data: {
          payments,
          count: payments.length,
        },
      });
    } catch (error) {
      console.error("Error searching payments:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search payments",
        error: error.message,
      });
    }
  },

  // Get payments by date range
  getPaymentsByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Both startDate and endDate are required",
        });
      }

      const payments = await SellerPayment.getByDateRange(startDate, endDate);

      res.json({
        success: true,
        message: "Payments retrieved successfully",
        data: {
          payments,
          count: payments.length,
          dateRange: { startDate, endDate },
        },
      });
    } catch (error) {
      console.error("Error getting payments by date range:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve payments",
        error: error.message,
      });
    }
  },

  // Get seller payment summary
  getPaymentSummary: async (req, res) => {
    try {
      const { sellerId } = req.params;
      const summary = await SellerPayment.getSellerPaymentSummary(sellerId);

      res.json({
        success: true,
        message: "Payment summary retrieved successfully",
        data: {
          summary,
        },
      });
    } catch (error) {
      console.error("Error getting payment summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve payment summary",
        error: error.message,
      });
    }
  },

  // Get daily payment report
  getDailyReport: async (req, res) => {
    try {
      const { date } = req.params;
      const report = await SellerPayment.getDailyReport(date);

      res.json({
        success: true,
        message: "Daily payment report retrieved successfully",
        data: {
          date,
          report,
          totalPayments: report.length > 0 ? report[0].TotalPayments : 0,
          totalAmount: report.length > 0 ? report[0].TotalAmount : 0,
        },
      });
    } catch (error) {
      console.error("Error getting daily payment report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve daily payment report",
        error: error.message,
      });
    }
  },
};

module.exports = sellerPaymentController;
