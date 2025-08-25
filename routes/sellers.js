const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authMiddleware = require("../middleware/auth");

// All seller routes require authentication
router.use(authMiddleware);

// Seller CRUD operations
router.post("/", sellerController.createSeller);
router.get("/", sellerController.getAllSellers);
router.get("/search", sellerController.searchSellers);
router.get("/:id", sellerController.getSellerById);
router.put("/:id", sellerController.updateSeller);
router.delete("/:id", sellerController.deleteSeller);

module.exports = router;
