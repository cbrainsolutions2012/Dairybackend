const { db } = require("../config/database");

const SellerPayment = {
  // Create a new seller payment
  create: async (paymentData) => {
    const {
      sellerId,
      paymentAmount,
      paymentDate,
      paymentType,
      transactionId,
      bankName,
      chequeNumber,
      ddNumber,
      referenceNumber,
      notes,
    } = paymentData;
    const sql = `INSERT INTO SellerPayments (SellerId, PaymentAmount, PaymentDate, PaymentType, TransactionId, BankName, ChequeNumber, DDNumber, ReferenceNumber, Notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [
      sellerId,
      paymentAmount,
      paymentDate,
      paymentType,
      transactionId,
      bankName,
      chequeNumber,
      ddNumber,
      referenceNumber,
      notes,
    ]);

    return result.insertId;
  },

  // Find payment by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM SellerPayments WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Get all seller payments
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM SellerPayments WHERE IsDeleted = 0 ORDER BY Date DESC, CreatedAt DESC"
    );
    return rows;
  },

  // Get payments by seller
  getBySellerId: async (sellerId) => {
    const [rows] = await db.execute(
      "SELECT sp.*, s.FullName as SellerName FROM SellerPayments sp JOIN Sellers s ON sp.SellerId = s.Id WHERE sp.SellerId = ? AND sp.IsDeleted = 0 ORDER BY sp.Date DESC",
      [sellerId]
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
      `UPDATE SellerPayments SET ${fields.join(", ")} WHERE Id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  // Soft delete payment
  delete: async (id) => {
    const [result] = await db.execute(
      "UPDATE SellerPayments SET IsDeleted = 1 WHERE Id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Search payments
  search: async (searchTerm) => {
    const [rows] = await db.execute(
      `SELECT * FROM SellerPayments 
       WHERE IsDeleted = 0 
       AND (SellerName LIKE ? OR PaymentType LIKE ? OR Notes LIKE ? OR TransactionId LIKE ?)
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
      "SELECT * FROM SellerPayments WHERE Date BETWEEN ? AND ? AND IsDeleted = 0 ORDER BY Date DESC",
      [startDate, endDate]
    );
    return rows;
  },

  // Get payment summary for a seller
  getSellerPaymentSummary: async (sellerId) => {
    const [rows] = await db.execute(
      `SELECT 
         COUNT(*) as TotalPayments,
         SUM(PaymentAmount) as TotalAmount,
         PaymentType,
         PaymentMethod
       FROM SellerPayments 
       WHERE SellerId = ? AND IsDeleted = 0 
       GROUP BY PaymentType, PaymentMethod`,
      [sellerId]
    );
    return rows;
  },

  // Get daily payment report
  getDailyReport: async (date) => {
    const [rows] = await db.execute(
      `SELECT 
         sp.*,
         COUNT(*) OVER() as TotalPayments,
         SUM(PaymentAmount) OVER() as TotalAmount
       FROM SellerPayments sp
       WHERE DATE(sp.Date) = ? AND sp.IsDeleted = 0
       ORDER BY sp.CreatedAt DESC`,
      [date]
    );
    return rows;
  },
};

module.exports = SellerPayment;
