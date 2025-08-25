const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyerController");
const authMiddleware = require("../middleware/auth");

// All buyer routes require authentication
router.use(authMiddleware);

// Buyer CRUD operations
router.post("/", buyerController.createBuyer);
router.get("/", buyerController.getAllBuyers);
router.get("/search", buyerController.searchBuyers);
router.get("/:id", buyerController.getBuyerById);
router.put("/:id", buyerController.updateBuyer);
router.delete("/:id", buyerController.deleteBuyer);

module.exports = router;
