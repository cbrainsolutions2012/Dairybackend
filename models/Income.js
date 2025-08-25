const { db } = require("../config/database");

const Income = {
  // Get all income records
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM Income WHERE IsDeleted = 0 ORDER BY Date DESC, CreatedAt DESC"
    );
    return rows;
  },

  // Find income by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM Income WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Get income by date range
  getByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      "SELECT * FROM Income WHERE Date BETWEEN ? AND ? AND IsDeleted = 0 ORDER BY Date DESC",
      [startDate, endDate]
    );
    return rows;
  },

  // Get income by source (person/company)
  getBySource: async (source) => {
    const [rows] = await db.execute(
      "SELECT * FROM Income WHERE Source LIKE ? AND IsDeleted = 0 ORDER BY Date DESC",
      [`%${source}%`]
    );
    return rows;
  },

  // Search income records
  search: async (searchTerm) => {
    const [rows] = await db.execute(
      `SELECT * FROM Income 
       WHERE IsDeleted = 0 
       AND (Description LIKE ? OR Source LIKE ?)
       ORDER BY Date DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  },

  // Get total income for a date range
  getTotalByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      "SELECT SUM(Amount) as TotalIncome, COUNT(*) as TotalRecords FROM Income WHERE Date BETWEEN ? AND ? AND IsDeleted = 0",
      [startDate, endDate]
    );
    return rows[0];
  },

  // Get daily income summary
  getDailySummary: async (date) => {
    const [rows] = await db.execute(
      `SELECT 
         SUM(Amount) as TotalIncome,
         COUNT(*) as TotalRecords,
         GROUP_CONCAT(DISTINCT Source) as Sources
       FROM Income 
       WHERE DATE(Date) = ? AND IsDeleted = 0`,
      [date]
    );
    return rows[0];
  },

  // Get monthly income summary
  getMonthlySummary: async (year, month) => {
    const [rows] = await db.execute(
      `SELECT 
         DATE(Date) as Date,
         SUM(Amount) as DailyIncome,
         COUNT(*) as DailyRecords
       FROM Income 
       WHERE YEAR(Date) = ? AND MONTH(Date) = ? AND IsDeleted = 0
       GROUP BY DATE(Date)
       ORDER BY Date DESC`,
      [year, month]
    );
    return rows;
  },

  // Get income by category/type (milk sales, payments, etc.)
  getByCategory: async () => {
    const [rows] = await db.execute(
      `SELECT 
         CASE 
           WHEN Description LIKE 'Milk sale%' THEN 'Milk Sales'
           WHEN Description LIKE 'Payment received%' THEN 'Customer Payments'
           ELSE 'Other Income'
         END as Category,
         SUM(Amount) as TotalAmount,
         COUNT(*) as TotalRecords
       FROM Income 
       WHERE IsDeleted = 0
       GROUP BY Category
       ORDER BY TotalAmount DESC`
    );
    return rows;
  },

  // Manual income creation (for non-automated entries)
  create: async ({ amount, description, source, date }) => {
    const [result] = await db.execute(
      `INSERT INTO Income (Amount, Description, Source, Date, CreatedAt, IsDeleted) 
       VALUES (?, ?, ?, ?, NOW(), 0)`,
      [amount, description, source, date]
    );
    return result.insertId;
  },

  // Update income record
  update: async (id, updateData) => {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach((key) => {
      if (
        updateData[key] !== undefined &&
        key !== "Id" &&
        key !== "CreatedAt" &&
        key !== "IsDeleted"
      ) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }

    values.push(id);

    const [result] = await db.execute(
      `UPDATE Income SET ${fields.join(", ")} WHERE Id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  // Soft delete income record
  delete: async (id) => {
    const [result] = await db.execute(
      "UPDATE Income SET IsDeleted = 1 WHERE Id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Income;
