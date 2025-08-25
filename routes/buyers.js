const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyerController");
const authMiddleware = require("../middleware/auth");

// All buyer routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/buyers:
 *   post:
 *     summary: Create a new buyer
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBuyerRequest'
 *     responses:
 *       201:
 *         description: Buyer created successfully
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
 *                         buyer:
 *                           $ref: '#/components/schemas/Buyer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all buyers
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyers retrieved successfully
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
 *                         buyers:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Buyer'
 */
router.post("/", buyerController.createBuyer);
router.get("/", buyerController.getAllBuyers);

/**
 * @swagger
 * /api/buyers/search:
 *   get:
 *     summary: Search buyers
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term for buyer name or phone
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
 *                         buyers:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Buyer'
 */
router.get("/search", buyerController.searchBuyers);

/**
 * @swagger
 * /api/buyers/{id}:
 *   get:
 *     summary: Get buyer by ID
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buyer ID
 *     responses:
 *       200:
 *         description: Buyer retrieved successfully
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
 *                         buyer:
 *                           $ref: '#/components/schemas/Buyer'
 *       404:
 *         description: Buyer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update buyer
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buyer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBuyerRequest'
 *     responses:
 *       200:
 *         description: Buyer updated successfully
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
 *                         buyer:
 *                           $ref: '#/components/schemas/Buyer'
 *       404:
 *         description: Buyer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete buyer
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buyer ID
 *     responses:
 *       200:
 *         description: Buyer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Buyer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", buyerController.getBuyerById);
router.put("/:id", buyerController.updateBuyer);
router.delete("/:id", buyerController.deleteBuyer);

module.exports = router;
