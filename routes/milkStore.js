const express = require("express");
const router = express.Router();
const milkStoreController = require("../controllers/milkStoreController");
const authMiddleware = require("../middleware/auth");

// All milk store routes require authentication
router.use(authMiddleware);

// Milk purchase operations
router.post("/", milkStoreController.createMilkPurchase);
router.get("/", milkStoreController.getAllMilkPurchases);
router.get("/search", milkStoreController.searchMilkPurchases);
router.get("/summary", milkStoreController.getMilkPurchaseSummary);
router.get("/daily-report/:date", milkStoreController.getDailyMilkReport);
router.get("/:id", milkStoreController.getMilkPurchaseById);
router.put("/:id", milkStoreController.updateMilkPurchase);
router.delete("/:id", milkStoreController.deleteMilkPurchase);

module.exports = router;
