const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/auth");

// All expense routes require authentication
router.use(authMiddleware);

// Expense operations
router.get("/", expenseController.getAllExpenses);
router.get("/search", expenseController.searchExpenses);
router.get("/date-range", expenseController.getExpenseByDateRange);
router.get("/category/:category", expenseController.getExpenseByCategory);
router.get("/categories", expenseController.getCategorySummary);
router.get("/breakdown", expenseController.getExpenseBreakdown);
router.get("/daily-summary/:date", expenseController.getDailySummary);
router.get(
  "/monthly-summary/:year/:month",
  expenseController.getMonthlySummary
);
router.post("/", expenseController.createExpense);
router.get("/:id", expenseController.getExpenseById);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
