const express = require("express");
const router = express.Router();
const milkDistributionController = require("../controllers/milkDistributionController");
const authMiddleware = require("../middleware/auth");

// All milk distribution routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/milk-distribution:
 *   post:
 *     summary: Create a new milk sale
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMilkDistributionRequest'
 *     responses:
 *       201:
 *         description: Milk sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         milkSale:
 *                           $ref: '#/components/schemas/MilkDistribution'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all milk sales
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Milk sales retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sales:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/MilkDistribution'
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 */
router.post("/", milkDistributionController.createMilkSale);
router.get("/", milkDistributionController.getAllMilkSales);

/**
 * @swagger
 * /api/milk-distribution/search:
 *   get:
 *     summary: Search milk sales
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term for buyer name
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sales:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/MilkDistribution'
 */
router.get("/search", milkDistributionController.searchMilkSales);

/**
 * @swagger
 * /api/milk-distribution/summary:
 *   get:
 *     summary: Get milk sales summary
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for summary (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for summary (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Milk sales summary
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         summary:
 *                           type: object
 *                           properties:
 *                             totalQuantity:
 *                               type: number
 *                             totalAmount:
 *                               type: number
 *                             averageRate:
 *                               type: number
 *                             transactionCount:
 *                               type: integer
 */
router.get("/summary", milkDistributionController.getMilkSalesSummary);

/**
 * @swagger
 * /api/milk-distribution/profit-analysis:
 *   get:
 *     summary: Get profit analysis
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analysis (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analysis (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Profit analysis data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         analysis:
 *                           type: object
 *                           properties:
 *                             totalPurchase:
 *                               type: number
 *                             totalSales:
 *                               type: number
 *                             totalProfit:
 *                               type: number
 *                             profitMargin:
 *                               type: number
 */
router.get("/profit-analysis", milkDistributionController.getProfitAnalysis);

/**
 * @swagger
 * /api/milk-distribution/daily-report/{date}:
 *   get:
 *     summary: Get daily milk sales report
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for the report (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daily milk sales report
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         report:
 *                           type: object
 *                           properties:
 *                             date:
 *                               type: string
 *                               format: date
 *                             totalQuantity:
 *                               type: number
 *                             totalAmount:
 *                               type: number
 *                             averageRate:
 *                               type: number
 *                             sales:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/MilkDistribution'
 */
router.get(
  "/daily-report/:date",
  milkDistributionController.getDailyMilkSalesReport
);

/**
 * @swagger
 * /api/milk-distribution/{id}:
 *   get:
 *     summary: Get milk sale by ID
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Milk sale ID
 *     responses:
 *       200:
 *         description: Milk sale retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sale:
 *                           $ref: '#/components/schemas/MilkDistribution'
 *       404:
 *         description: Milk sale not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update milk sale
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Milk sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMilkDistributionRequest'
 *     responses:
 *       200:
 *         description: Milk sale updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sale:
 *                           $ref: '#/components/schemas/MilkDistribution'
 *       404:
 *         description: Milk sale not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete milk sale
 *     tags: [Milk Distribution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Milk sale ID
 *     responses:
 *       200:
 *         description: Milk sale deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Milk sale not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", milkDistributionController.getMilkSaleById);
router.put("/:id", milkDistributionController.updateMilkSale);
router.delete("/:id", milkDistributionController.deleteMilkSale);

module.exports = router;
