const { db } = require("../config/database");

const BuyerPayment = {
  // Create a new payment record
  create: async (paymentData) => {
    const {
      buyerId,
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

    const sql = `
      INSERT INTO BuyerPayments (
        BuyerId, PaymentAmount, PaymentDate, PaymentType, TransactionId,
        BankName, ChequeNumber, DdNumber, ReferenceNumber, Notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute(sql, [
      buyerId,
      paymentAmount,
      paymentDate,
      paymentType,
      transactionId || null,
      bankName || null,
      chequeNumber || null,
      ddNumber || null,
      referenceNumber || null,
      notes || null,
    ]);

    return result.insertId;
  },

  // Update an existing payment record
  update: async (id, updateData) => {
    const fields = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updateData), id];

    if (Object.keys(updateData).length === 0) return false;

    const sql = `UPDATE BuyerPayments SET ${fields} WHERE Id = ?`;
    const [result] = await db.execute(sql, values);

    return result.affectedRows > 0;
  },

  // Find a single payment by its ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM BuyerPayments WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Get all non-deleted payments
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT bp.*, b.FullName AS BuyerName FROM BuyerPayments bp JOIN Buyers b ON bp.BuyerId = b.Id WHERE bp.IsDeleted = 0 ORDER BY bp.PaymentDate DESC"
    );
    return rows;
  },

  // Soft delete a payment
  delete: async (id) => {
    const [result] = await db.execute(
      "UPDATE BuyerPayments SET IsDeleted = 1 WHERE Id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = BuyerPayment;
