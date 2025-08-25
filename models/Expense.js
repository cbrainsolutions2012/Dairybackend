const { db } = require("../config/database");

const Expense = {
  // Get all expense records
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM Expense WHERE IsDeleted = 0 ORDER BY Date DESC, CreatedAt DESC"
    );
    return rows;
  },

  // Find expense by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM Expense WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Get expense by date range
  getByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      "SELECT * FROM Expense WHERE Date BETWEEN ? AND ? AND IsDeleted = 0 ORDER BY Date DESC",
      [startDate, endDate]
    );
    return rows;
  },

  // Get expense by category
  getByCategory: async (category) => {
    const [rows] = await db.execute(
      "SELECT * FROM Expense WHERE Category = ? AND IsDeleted = 0 ORDER BY Date DESC",
      [category]
    );
    return rows;
  },

  // Get expense by paid to (person/company)
  getByPaidTo: async (paidTo) => {
    const [rows] = await db.execute(
      "SELECT * FROM Expense WHERE PaidTo LIKE ? AND IsDeleted = 0 ORDER BY Date DESC",
      [`%${paidTo}%`]
    );
    return rows;
  },

  // Search expense records
  search: async (searchTerm) => {
    const [rows] = await db.execute(
      `SELECT * FROM Expense 
       WHERE IsDeleted = 0 
       AND (Description LIKE ? OR PaidTo LIKE ? OR Category LIKE ?)
       ORDER BY Date DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  },

  // Get total expense for a date range
  getTotalByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      "SELECT SUM(Amount) as TotalExpense, COUNT(*) as TotalRecords FROM Expense WHERE Date BETWEEN ? AND ? AND IsDeleted = 0",
      [startDate, endDate]
    );
    return rows[0];
  },

  // Get daily expense summary
  getDailySummary: async (date) => {
    const [rows] = await db.execute(
      `SELECT 
         SUM(Amount) as TotalExpense,
         COUNT(*) as TotalRecords,
         GROUP_CONCAT(DISTINCT Category) as Categories
       FROM Expense 
       WHERE DATE(Date) = ? AND IsDeleted = 0`,
      [date]
    );
    return rows[0];
  },

  // Get monthly expense summary
  getMonthlySummary: async (year, month) => {
    const [rows] = await db.execute(
      `SELECT 
         DATE(Date) as Date,
         SUM(Amount) as DailyExpense,
         COUNT(*) as DailyRecords
       FROM Expense 
       WHERE YEAR(Date) = ? AND MONTH(Date) = ? AND IsDeleted = 0
       GROUP BY DATE(Date)
       ORDER BY Date DESC`,
      [year, month]
    );
    return rows;
  },

  // Get expense by category summary
  getCategorySummary: async () => {
    const [rows] = await db.execute(
      `SELECT 
         Category,
         SUM(Amount) as TotalAmount,
         COUNT(*) as TotalRecords,
         AVG(Amount) as AverageAmount
       FROM Expense 
       WHERE IsDeleted = 0
       GROUP BY Category
       ORDER BY TotalAmount DESC`
    );
    return rows;
  },

  // Get expense by milk purchases vs other expenses
  getExpenseBreakdown: async () => {
    const [rows] = await db.execute(
      `SELECT 
         CASE 
           WHEN Category = 'milk_purchase' THEN 'Milk Purchases'
           WHEN Description LIKE 'Payment made%' THEN 'Seller Payments'
           ELSE 'Other Expenses'
         END as ExpenseType,
         SUM(Amount) as TotalAmount,
         COUNT(*) as TotalRecords
       FROM Expense 
       WHERE IsDeleted = 0
       GROUP BY ExpenseType
       ORDER BY TotalAmount DESC`
    );
    return rows;
  },

  // Manual expense creation (for non-automated entries)
  create: async ({ amount, description, paidTo, category, date }) => {
    const [result] = await db.execute(
      `INSERT INTO Expense (Amount, Description, PaidTo, Category, Date, CreatedAt, IsDeleted) 
       VALUES (?, ?, ?, ?, ?, NOW(), 0)`,
      [amount, description, paidTo, category || "other", date]
    );
    return result.insertId;
  },

  // Update expense record
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
      `UPDATE Expense SET ${fields.join(", ")} WHERE Id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  // Soft delete expense record
  delete: async (id) => {
    const [result] = await db.execute(
      "UPDATE Expense SET IsDeleted = 1 WHERE Id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Expense;
