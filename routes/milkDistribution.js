const express = require("express");
const router = express.Router();
const milkDistributionController = require("../controllers/milkDistributionController");
const authMiddleware = require("../middleware/auth");

// All milk distribution routes require authentication
router.use(authMiddleware);

// Milk sales operations
router.post("/", milkDistributionController.createMilkSale);
router.get("/", milkDistributionController.getAllMilkSales);
router.get("/search", milkDistributionController.searchMilkSales);
router.get("/summary", milkDistributionController.getMilkSalesSummary);
router.get("/profit-analysis", milkDistributionController.getProfitAnalysis);
router.get(
  "/daily-report/:date",
  milkDistributionController.getDailyMilkSalesReport
);
router.get("/:id", milkDistributionController.getMilkSaleById);
router.put("/:id", milkDistributionController.updateMilkSale);
router.delete("/:id", milkDistributionController.deleteMilkSale);

module.exports = router;
