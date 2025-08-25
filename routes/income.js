const express = require("express");
const router = express.Router();
const incomeController = require("../controllers/incomeController");
const authMiddleware = require("../middleware/auth");

// All income routes require authentication
router.use(authMiddleware);

// Income operations
router.get("/", incomeController.getAllIncome);
router.get("/search", incomeController.searchIncome);
router.get("/date-range", incomeController.getIncomeByDateRange);
router.get("/categories", incomeController.getIncomeByCategory);
router.get("/daily-summary/:date", incomeController.getDailySummary);
router.get("/monthly-summary/:year/:month", incomeController.getMonthlySummary);
router.post("/", incomeController.createIncome);
router.get("/:id", incomeController.getIncomeById);
router.put("/:id", incomeController.updateIncome);
router.delete("/:id", incomeController.deleteIncome);

module.exports = router;
