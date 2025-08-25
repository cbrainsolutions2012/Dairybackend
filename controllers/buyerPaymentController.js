const BuyerPayment = require("../models/BuyerPayment");
const Buyer = require("../models/Buyer");

const buyerPaymentController = {
  // Create new buyer payment
  createPayment: async (req, res) => {
    try {
      const {
        buyerId,
        paymentAmount,
        paymentType,
        paymentMethod,
        transactionId,
        notes,
        date,
      } = req.body;

      // Validation
      if (
        !buyerId ||
        !paymentAmount ||
        !paymentType ||
        !paymentMethod ||
        !date
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Required fields: buyerId, paymentAmount, paymentType, paymentMethod, date",
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

      // Check if buyer exists
      const buyer = await Buyer.findById(buyerId);
      if (!buyer) {
        return res.status(404).json({
          success: false,
          message: "Buyer not found",
        });
      }

      // Create payment record (this will trigger buyer_payment_income)
      const paymentId = await BuyerPayment.create({
        buyerId,
        buyerName: buyer.Name,
        paymentAmount,
        paymentType,
        paymentMethod,
        transactionId: transactionId || null,
        notes: notes || null,
        date,
      });

      // Get the created payment
      const payment = await BuyerPayment.findById(paymentId);

      res.status(201).json({
        success: true,
        message: "Buyer payment recorded successfully",
        data: {
          payment,
        },
      });
    } catch (error) {
      console.error("Error creating buyer payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record buyer payment",
        error: error.message,
      });
    }
  },

  // Get all buyer payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await BuyerPayment.getAll();

      res.json({
        success: true,
        message: "Buyer payments retrieved successfully",
        data: {
          payments,
          count: payments.length,
        },
      });
    } catch (error) {
      console.error("Error getting buyer payments:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve buyer payments",
        error: error.message,
      });
    }
  },

  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await BuyerPayment.findById(id);

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

  // Get payments by buyer
  getPaymentsByBuyer: async (req, res) => {
    try {
      const { buyerId } = req.params;
      const payments = await BuyerPayment.getByBuyerId(buyerId);

      res.json({
        success: true,
        message: "Buyer payments retrieved successfully",
        data: {
          payments,
          count: payments.length,
        },
      });
    } catch (error) {
      console.error("Error getting payments by buyer:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve buyer payments",
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

      const updated = await BuyerPayment.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      const payment = await BuyerPayment.findById(id);

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

      const deleted = await BuyerPayment.delete(id);

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

      const payments = await BuyerPayment.search(q);

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

      const payments = await BuyerPayment.getByDateRange(startDate, endDate);

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

  // Get buyer payment summary
  getPaymentSummary: async (req, res) => {
    try {
      const { buyerId } = req.params;
      const summary = await BuyerPayment.getBuyerPaymentSummary(buyerId);

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
      const report = await BuyerPayment.getDailyReport(date);

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

module.exports = buyerPaymentController;
