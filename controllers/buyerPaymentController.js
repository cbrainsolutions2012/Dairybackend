const BuyerPayment = require("../models/BuyerPayment");
const Buyer = require("../models/Buyer"); // You need this to get buyer's name

const buyerPaymentController = {
  // Create a new payment
  createPayment: async (req, res) => {
    try {
      const {
        buyerId,
        paymentAmount,
        paymentDate,
        paymentType,
        transactionId,
        bankName,
        chequeNumber,
        ddNumber,
        referenceNumber,
        notes,
      } = req.body;

      if (!buyerId || !paymentAmount || !paymentDate || !paymentType) {
        return res
          .status(400)
          .json({ success: false, message: "Required fields are missing." });
      }

      // Fetch the buyer's name to store in the payments table for convenience
      const buyer = await Buyer.findById(buyerId);
      if (!buyer) {
        return res
          .status(404)
          .json({ success: false, message: "Buyer not found" });
      }

      const paymentData = {
        buyerId,
        buyerName: buyer.FullName, // Storing the name
        paymentAmount,
        paymentDate,
        paymentType,
        transactionId,
        bankName,
        chequeNumber,
        ddNumber,
        referenceNumber,
        notes,
      };

      const newPaymentId = await BuyerPayment.create(paymentData);
      const newPayment = await BuyerPayment.findById(newPaymentId);

      res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: { payment: newPayment },
      });
    } catch (error) {
      console.error("Create Payment Error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Server error during payment creation.",
        });
    }
  },

  // Update an existing payment
  updatePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const success = await BuyerPayment.update(id, updateData);
      if (!success) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Payment not found or no changes made.",
          });
      }

      const updatedPayment = await BuyerPayment.findById(id);
      res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        data: { payment: updatedPayment },
      });
    } catch (error) {
      console.error("Update Payment Error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Server error during payment update.",
        });
    }
  },

  // Get all payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await BuyerPayment.getAll();
      res.status(200).json({ success: true, data: { payments } });
    } catch (error) {
      console.error("Get All Payments Error:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },

  // Get single payment
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await BuyerPayment.findById(id);
      if (!payment) {
        return res
          .status(404)
          .json({ success: false, message: "Payment not found." });
      }
      res.status(200).json({ success: true, data: { payment } });
    } catch (error) {
      console.error("Get Payment By ID Error:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },

  // Delete a payment
  deletePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await BuyerPayment.delete(id);
      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Payment not found." });
      }
      res
        .status(200)
        .json({ success: true, message: "Payment deleted successfully." });
    } catch (error) {
      console.error("Delete Payment Error:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },
};

module.exports = buyerPaymentController;
