const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/auth");

// All dashboard routes require authentication
router.use(authMiddleware);

// Dashboard and analytics routes
router.get("/financial-overview", dashboardController.getFinancialOverview);
router.get("/daily-profit-loss/:date", dashboardController.getDailyProfitLoss);
router.get(
  "/monthly-trends/:year/:month",
  dashboardController.getMonthlyTrends
);
router.get("/milk-analytics", dashboardController.getMilkBusinessAnalytics);
router.get("/payment-analytics", dashboardController.getPaymentAnalytics);

module.exports = router;
