const express = require("express");
const router = express.Router();
const incomeController = require("../controllers/incomeController");
const authMiddleware = require("../middleware/auth");

// All income routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/income:
 *   get:
 *     summary: Get all income records
 *     tags: [Income]
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
 *         description: Income records retrieved successfully
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
 *                         income:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Income'
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *   post:
 *     summary: Create a new income record
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIncomeRequest'
 *     responses:
 *       201:
 *         description: Income created successfully
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
 *                         income:
 *                           $ref: '#/components/schemas/Income'
 */
router.get("/", incomeController.getAllIncome);

/**
 * @swagger
 * /api/income/search:
 *   get:
 *     summary: Search income records
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term for description or category
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
 *                         income:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Income'
 */
router.get("/search", incomeController.searchIncome);

/**
 * @swagger
 * /api/income/date-range:
 *   get:
 *     summary: Get income by date range
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Income in date range
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
 *                         income:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Income'
 */
router.get("/date-range", incomeController.getIncomeByDateRange);

/**
 * @swagger
 * /api/income/categories:
 *   get:
 *     summary: Get income grouped by category
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Income by category
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
 *                         categories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               category:
 *                                 type: string
 *                               totalAmount:
 *                                 type: number
 *                               count:
 *                                 type: integer
 */
router.get("/categories", incomeController.getIncomeByCategory);

/**
 * @swagger
 * /api/income/daily-summary/{date}:
 *   get:
 *     summary: Get daily income summary
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for the summary (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daily income summary
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
 *                             date:
 *                               type: string
 *                               format: date
 *                             totalAmount:
 *                               type: number
 *                             transactionCount:
 *                               type: integer
 */
router.get("/daily-summary/:date", incomeController.getDailySummary);

/**
 * @swagger
 * /api/income/monthly-summary/{year}/{month}:
 *   get:
 *     summary: Get monthly income summary
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (YYYY)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *     responses:
 *       200:
 *         description: Monthly income summary
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
 *                             year:
 *                               type: integer
 *                             month:
 *                               type: integer
 *                             totalAmount:
 *                               type: number
 *                             transactionCount:
 *                               type: integer
 */
router.get("/monthly-summary/:year/:month", incomeController.getMonthlySummary);

router.post("/", incomeController.createIncome);

/**
 * @swagger
 * /api/income/{id}:
 *   get:
 *     summary: Get income by ID
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Income ID
 *     responses:
 *       200:
 *         description: Income retrieved successfully
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
 *                         income:
 *                           $ref: '#/components/schemas/Income'
 *       404:
 *         description: Income not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update income
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Income ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIncomeRequest'
 *     responses:
 *       200:
 *         description: Income updated successfully
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
 *                         income:
 *                           $ref: '#/components/schemas/Income'
 *       404:
 *         description: Income not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete income
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Income ID
 *     responses:
 *       200:
 *         description: Income deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Income not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", incomeController.getIncomeById);
router.put("/:id", incomeController.updateIncome);
router.delete("/:id", incomeController.deleteIncome);

module.exports = router;
