const express = require("express");
const router = express.Router();
const buyerPaymentController = require("../controllers/buyerPaymentController");
const authMiddleware = require("../middleware/auth");

// All buyer payment routes require authentication
router.use(authMiddleware);

// Buyer payment operations
router.post("/", buyerPaymentController.createPayment);
router.get("/", buyerPaymentController.getAllPayments);
router.get("/search", buyerPaymentController.searchPayments);
router.get("/date-range", buyerPaymentController.getPaymentsByDateRange);
router.get("/daily-report/:date", buyerPaymentController.getDailyReport);
router.get("/buyer/:buyerId", buyerPaymentController.getPaymentsByBuyer);
router.get("/buyer/:buyerId/summary", buyerPaymentController.getPaymentSummary);
router.get("/:id", buyerPaymentController.getPaymentById);
router.put("/:id", buyerPaymentController.updatePayment);
router.delete("/:id", buyerPaymentController.deletePayment);

module.exports = router;
