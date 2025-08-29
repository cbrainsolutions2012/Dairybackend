const express = require("express");
const router = express.Router();
const milkStoreController = require("../controllers/milkStoreController");
const authMiddleware = require("../middleware/auth");

// All milk store routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/milk-store:
 *   post:
 *     summary: Create a new milk purchase
 *     tags: [Milk Store]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMilkStoreRequest'
 *     responses:
 *       201:
 *         description: Milk purchase created successfully
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
 *                         milkPurchase:
 *                           $ref: '#/components/schemas/MilkStore'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all milk purchases
 *     tags: [Milk Store]
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
 *         description: Milk purchases retrieved successfully
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
 *                         purchases:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/MilkStore'
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 */
router.post("/", milkStoreController.createMilkPurchase);
router.get("/", milkStoreController.getAllMilkPurchases);

/**
 * @swagger
 * /api/milk-store/search:
 *   get:
 *     summary: Search milk purchases
 *     tags: [Milk Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term for seller name
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
 *                         purchases:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/MilkStore'
 */
router.get("/search", milkStoreController.searchMilkPurchases);

/**
 * @swagger
 * /api/milk-store/summary:
 *   get:
 *     summary: Get milk purchase summary
 *     tags: [Milk Store]
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
 *         description: Milk purchase summary
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
router.get("/summary", milkStoreController.getMilkPurchaseSummary);

/**
 * @swagger
 * /api/milk-store/daily-report/{date}:
 *   get:
 *     summary: Get daily milk report
 *     tags: [Milk Store]
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
 *         description: Daily milk report
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
 *                             purchases:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/MilkStore'
 */
router.get("/daily-report/:date", milkStoreController.getDailyMilkReport);

/**
 * @swagger
 * /api/milk-store/{id}:
 *   get:
 *     summary: Get milk purchase by ID
 *     tags: [Milk Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Milk purchase ID
 *     responses:
 *       200:
 *         description: Milk purchase retrieved successfully
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
 *                         purchase:
 *                           $ref: '#/components/schemas/MilkStore'
 *       404:
 *         description: Milk purchase not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update milk purchase
 *     tags: [Milk Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Milk purchase ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMilkStoreRequest'
 *     responses:
 *       200:
 *         description: Milk purchase updated successfully
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
 *                         purchase:
 *                           $ref: '#/components/schemas/MilkStore'
 *       404:
 *         description: Milk purchase not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete milk purchase
 *     tags: [Milk Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Milk purchase ID
 *     responses:
 *       200:
 *         description: Milk purchase deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Milk purchase not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", milkStoreController.getMilkPurchaseById);
router.put("/:id", milkStoreController.updateMilkPurchase);
router.delete("/:id", milkStoreController.deleteMilkPurchase);

module.exports = router;
