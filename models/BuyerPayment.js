const { db } = require("../config/database");

const BuyerPayment = {
  // Create a new buyer payment
  create: async ({
    buyerId,
    buyerName,
    paymentAmount,
    paymentType,
    paymentMethod,
    transactionId,
    notes,
    date,
  }) => {
    const [result] = await db.execute(
      `INSERT INTO BuyerPayments (BuyerId, BuyerName, PaymentAmount, PaymentType, PaymentMethod, TransactionId, Notes, Date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        buyerId,
        buyerName,
        paymentAmount,
        paymentType,
        paymentMethod,
        transactionId,
        notes,
        date,
      ]
    );

    return result.insertId;
  },

  // Find payment by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM BuyerPayments WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Get all buyer payments
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM BuyerPayments WHERE IsDeleted = 0 ORDER BY Date DESC, CreatedAt DESC"
    );
    return rows;
  },

  // Get payments by buyer
  getByBuyerId: async (buyerId) => {
    const [rows] = await db.execute(
      "SELECT * FROM BuyerPayments WHERE BuyerId = ? AND IsDeleted = 0 ORDER BY Date DESC",
      [buyerId]
    );
    return rows;
  },

  // Update payment
  update: async (id, updateData) => {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }

    values.push(id);

    const [result] = await db.execute(
      `UPDATE BuyerPayments SET ${fields.join(", ")} WHERE Id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  // Soft delete payment
  delete: async (id) => {
    const [result] = await db.execute(
      "UPDATE BuyerPayments SET IsDeleted = 1 WHERE Id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Search payments
  search: async (searchTerm) => {
    const [rows] = await db.execute(
      `SELECT * FROM BuyerPayments 
       WHERE IsDeleted = 0 
       AND (BuyerName LIKE ? OR PaymentType LIKE ? OR Notes LIKE ? OR TransactionId LIKE ?)
       ORDER BY Date DESC`,
      [
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
      ]
    );
    return rows;
  },

  // Get payments by date range
  getByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      "SELECT * FROM BuyerPayments WHERE Date BETWEEN ? AND ? AND IsDeleted = 0 ORDER BY Date DESC",
      [startDate, endDate]
    );
    return rows;
  },

  // Get payment summary for a buyer
  getBuyerPaymentSummary: async (buyerId) => {
    const [rows] = await db.execute(
      `SELECT 
         COUNT(*) as TotalPayments,
         SUM(PaymentAmount) as TotalAmount,
         PaymentType,
         PaymentMethod
       FROM BuyerPayments 
       WHERE BuyerId = ? AND IsDeleted = 0 
       GROUP BY PaymentType, PaymentMethod`,
      [buyerId]
    );
    return rows;
  },

  // Get daily payment report
  getDailyReport: async (date) => {
    const [rows] = await db.execute(
      `SELECT 
         bp.*,
         COUNT(*) OVER() as TotalPayments,
         SUM(PaymentAmount) OVER() as TotalAmount
       FROM BuyerPayments bp
       WHERE DATE(bp.Date) = ? AND bp.IsDeleted = 0
       ORDER BY bp.CreatedAt DESC`,
      [date]
    );
    return rows;
  },
};

module.exports = BuyerPayment;
