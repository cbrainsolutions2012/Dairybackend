const express = require("express");
const router = express.Router();
const sellerPaymentController = require("../controllers/sellerPaymentController");
const authMiddleware = require("../middleware/auth");

// All seller payment routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/sellerpayments:
 *   post:
 *     summary: Create a new seller payment
 *     tags: [Seller Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSellerPaymentRequest'
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
 *                           $ref: '#/components/schemas/SellerPayment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all seller payments
 *     tags: [Seller Payments]
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
 *                             $ref: '#/components/schemas/SellerPayment'
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 */
router.post("/", sellerPaymentController.createPayment);
router.get("/", sellerPaymentController.getAllPayments);

/**
 * @swagger
 * /api/sellerpayments/search:
 *   get:
 *     summary: Search seller payments
 *     tags: [Seller Payments]
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
 *                         payments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/SellerPayment'
 */
router.get("/search", sellerPaymentController.searchPayments);

/**
 * @swagger
 * /api/sellerpayments/date-range:
 *   get:
 *     summary: Get payments by date range
 *     tags: [Seller Payments]
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
 *                             $ref: '#/components/schemas/SellerPayment'
 */
router.get("/date-range", sellerPaymentController.getPaymentsByDateRange);

/**
 * @swagger
 * /api/sellerpayments/daily-report/{date}:
 *   get:
 *     summary: Get daily payment report
 *     tags: [Seller Payments]
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
 *                                 $ref: '#/components/schemas/SellerPayment'
 */
router.get("/daily-report/:date", sellerPaymentController.getDailyReport);

/**
 * @swagger
 * /api/sellerpayments/seller/{sellerId}:
 *   get:
 *     summary: Get payments by seller
 *     tags: [Seller Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: Seller payments retrieved successfully
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
 *                             $ref: '#/components/schemas/SellerPayment'
 */
router.get("/seller/:sellerId", sellerPaymentController.getPaymentsBySeller);

/**
 * @swagger
 * /api/sellerpayments/seller/{sellerId}/summary:
 *   get:
 *     summary: Get payment summary for seller
 *     tags: [Seller Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seller ID
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
router.get(
  "/seller/:sellerId/summary",
  sellerPaymentController.getPaymentSummary
);

/**
 * @swagger
 * /api/sellerpayments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Seller Payments]
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
 *                           $ref: '#/components/schemas/SellerPayment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update payment
 *     tags: [Seller Payments]
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
 *             $ref: '#/components/schemas/UpdateSellerPaymentRequest'
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
 *                           $ref: '#/components/schemas/SellerPayment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete payment
 *     tags: [Seller Payments]
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
router.get("/:id", sellerPaymentController.getPaymentById);
router.put("/:id", sellerPaymentController.updatePayment);
router.delete("/:id", sellerPaymentController.deletePayment);

module.exports = router;
