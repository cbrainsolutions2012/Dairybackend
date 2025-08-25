const express = require("express");
const router = express.Router();
const sellerPaymentController = require("../controllers/sellerPaymentController");
const authMiddleware = require("../middleware/auth");

// All seller payment routes require authentication
router.use(authMiddleware);

// Seller payment operations
router.post("/", sellerPaymentController.createPayment);
router.get("/", sellerPaymentController.getAllPayments);
router.get("/search", sellerPaymentController.searchPayments);
router.get("/date-range", sellerPaymentController.getPaymentsByDateRange);
router.get("/daily-report/:date", sellerPaymentController.getDailyReport);
router.get("/seller/:sellerId", sellerPaymentController.getPaymentsBySeller);
router.get(
  "/seller/:sellerId/summary",
  sellerPaymentController.getPaymentSummary
);
router.get("/:id", sellerPaymentController.getPaymentById);
router.put("/:id", sellerPaymentController.updatePayment);
router.delete("/:id", sellerPaymentController.deletePayment);

module.exports = router;
