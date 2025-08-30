const express = require("express");
const router = express.Router();
const buyerPaymentController = require("../controllers/buyerPaymentController");
const authMiddleware = require("../middleware/auth");

// All buyer payment routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/buyerpayments:
 *   post:
 *     summary: Create a new buyer payment
 *     tags: [Buyer Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBuyerPaymentRequest'
 *     responses:
 *       201:
 *         description: Payment created successfully
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
 *                         payment:
 *                           $ref: '#/components/schemas/BuyerPayment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all buyer payments
 *     tags: [Buyer Payments]
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
 *         description: Payments retrieved successfully
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
 *                         payments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/BuyerPayment'
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 */
router.post("/", buyerPaymentController.createPayment);
router.get("/", buyerPaymentController.getAllPayments);

// /**
//  * @swagger
//  * /api/buyerpayments/search:
//  *   get:
//  *     summary: Search buyer payments
//  *     tags: [Buyer Payments]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: q
//  *         schema:
//  *           type: string
//  *         description: Search term for buyer name
//  *       - in: query
//  *         name: date
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Filter by date (YYYY-MM-DD)
//  *     responses:
//  *       200:
//  *         description: Search results
//  *         content:
//  *           application/json:
//  *             schema:
//  *               allOf:
//  *                 - $ref: '#/components/schemas/SuccessResponse'
//  *                 - type: object
//  *                   properties:
//  *                     data:
//  *                       type: object
//  *                       properties:
//  *                         payments:
//  *                           type: array
//  *                           items:
//  *                             $ref: '#/components/schemas/BuyerPayment'
//  */
// router.get("/search", buyerPaymentController.searchPayments);

/**
 * @swagger
 * /api/buyerpayments/date-range:
 *   get:
 *     summary: Get payments by date range
 *     tags: [Buyer Payments]
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
 *         description: Payments in date range
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
 *                         payments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/BuyerPayment'
 */
router.get("/date-range", buyerPaymentController.getPaymentsByDateRange);

/**
 * @swagger
 * /api/buyerpayments/daily-report/{date}:
 *   get:
 *     summary: Get daily payment report
 *     tags: [Buyer Payments]
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
 *         description: Daily payment report
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
 *                             totalAmount:
 *                               type: number
 *                             totalTransactions:
 *                               type: integer
 *                             payments:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/BuyerPayment'
 */
router.get("/daily-report/:date", buyerPaymentController.getDailyReport);

/**
 * @swagger
 * /api/buyerpayments/buyer/{buyerId}:
 *   get:
 *     summary: Get payments by buyer
 *     tags: [Buyer Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: buyerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buyer ID
 *     responses:
 *       200:
 *         description: Buyer payments retrieved successfully
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
 *                         payments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/BuyerPayment'
 */
router.get("/buyer/:buyerId", buyerPaymentController.getPaymentsByBuyer);

/**
 * @swagger
 * /api/buyerpayments/buyer/{buyerId}/summary:
 *   get:
 *     summary: Get payment summary for buyer
 *     tags: [Buyer Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: buyerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buyer ID
 *     responses:
 *       200:
 *         description: Payment summary retrieved successfully
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
 *                             totalPayments:
 *                               type: number
 *                             totalTransactions:
 *                               type: integer
 *                             lastPaymentDate:
 *                               type: string
 *                               format: date
 */
router.get("/buyer/:buyerId/summary", buyerPaymentController.getPaymentSummary);

/**
 * @swagger
 * /api/buyerpayments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Buyer Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
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
 *                         payment:
 *                           $ref: '#/components/schemas/BuyerPayment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update payment
 *     tags: [Buyer Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBuyerPaymentRequest'
 *     responses:
 *       200:
 *         description: Payment updated successfully
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
 *                         payment:
 *                           $ref: '#/components/schemas/BuyerPayment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete payment
 *     tags: [Buyer Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", buyerPaymentController.getPaymentById);
router.put("/:id", buyerPaymentController.updatePayment);
router.delete("/:id", buyerPaymentController.deletePayment);

module.exports = router;
