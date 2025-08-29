const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/auth");

// All dashboard routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get simple dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     description: Get essential dashboard data - total buyers, sellers, and current month income/expense
 *     responses:
 *       200:
 *         description: Dashboard summary data
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
 *                         totalBuyers:
 *                           type: integer
 *                           description: Total number of active buyers
 *                         totalSellers:
 *                           type: integer
 *                           description: Total number of active sellers
 *                         thisMonthIncome:
 *                           type: number
 *                           description: Total income for current month
 *                         thisMonthExpense:
 *                           type: number
 *                           description: Total expense for current month
 *                         thisMonthProfit:
 *                           type: number
 *                           description: Net profit for current month
 *                         month:
 *                           type: string
 *                           description: Current month name
 *                         year:
 *                           type: integer
 *                           description: Current year
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/summary", dashboardController.getDashboardSummary);

/**
 * @swagger
 * /api/dashboard/financial-overview:
 *   get:
 *     summary: Get financial overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial overview data
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
 *                         overview:
 *                           type: object
 *                           properties:
 *                             totalIncome:
 *                               type: number
 *                             totalExpenses:
 *                               type: number
 *                             netProfit:
 *                               type: number
 *                             milkPurchases:
 *                               type: number
 *                             milkSales:
 *                               type: number
 *                             totalBuyers:
 *                               type: integer
 *                             totalSellers:
 *                               type: integer
 */
router.get("/financial-overview", dashboardController.getFinancialOverview);

/**
 * @swagger
 * /api/dashboard/daily-profit-loss/{date}:
 *   get:
 *     summary: Get daily profit and loss
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for the profit/loss report (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daily profit and loss data
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
 *                         profitLoss:
 *                           type: object
 *                           properties:
 *                             date:
 *                               type: string
 *                               format: date
 *                             totalIncome:
 *                               type: number
 *                             totalExpenses:
 *                               type: number
 *                             netProfit:
 *                               type: number
 *                             milkPurchases:
 *                               type: number
 *                             milkSales:
 *                               type: number
 *                             grossProfit:
 *                               type: number
 */
router.get("/daily-profit-loss/:date", dashboardController.getDailyProfitLoss);

/**
 * @swagger
 * /api/dashboard/monthly-trends/{year}/{month}:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
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
 *         description: Monthly trends data
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
 *                         trends:
 *                           type: object
 *                           properties:
 *                             year:
 *                               type: integer
 *                             month:
 *                               type: integer
 *                             dailyData:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   date:
 *                                     type: string
 *                                     format: date
 *                                   income:
 *                                     type: number
 *                                   expenses:
 *                                     type: number
 *                                   profit:
 *                                     type: number
 *                             summary:
 *                               type: object
 *                               properties:
 *                                 totalIncome:
 *                                   type: number
 *                                 totalExpenses:
 *                                   type: number
 *                                 netProfit:
 *                                   type: number
 */
router.get(
  "/monthly-trends/:year/:month",
  dashboardController.getMonthlyTrends
);

/**
 * @swagger
 * /api/dashboard/milk-analytics:
 *   get:
 *     summary: Get milk business analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milk business analytics data
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
 *                         analytics:
 *                           type: object
 *                           properties:
 *                             totalMilkPurchased:
 *                               type: number
 *                             totalMilkSold:
 *                               type: number
 *                             averagePurchaseRate:
 *                               type: number
 *                             averageSaleRate:
 *                               type: number
 *                             profitMargin:
 *                               type: number
 *                             topSellers:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   sellerId:
 *                                     type: integer
 *                                   sellerName:
 *                                     type: string
 *                                   totalQuantity:
 *                                     type: number
 *                                   totalAmount:
 *                                     type: number
 *                             topBuyers:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   buyerId:
 *                                     type: integer
 *                                   buyerName:
 *                                     type: string
 *                                   totalQuantity:
 *                                     type: number
 *                                   totalAmount:
 *                                     type: number
 */
router.get("/milk-analytics", dashboardController.getMilkBusinessAnalytics);

/**
 * @swagger
 * /api/dashboard/payment-analytics:
 *   get:
 *     summary: Get payment analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment analytics data
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
 *                         analytics:
 *                           type: object
 *                           properties:
 *                             totalSellerPayments:
 *                               type: number
 *                             totalBuyerPayments:
 *                               type: number
 *                             pendingSellerPayments:
 *                               type: number
 *                             pendingBuyerPayments:
 *                               type: number
 *                             recentPayments:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   type:
 *                                     type: string
 *                                     enum: [seller, buyer]
 *                                   amount:
 *                                     type: number
 *                                   date:
 *                                     type: string
 *                                     format: date
 *                                   personName:
 *                                     type: string
 */
router.get("/payment-analytics", dashboardController.getPaymentAnalytics);

module.exports = router;
