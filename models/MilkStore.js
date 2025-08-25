const { db } = require("../config/database");

const MilkStore = {
  // Find milk store record by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkStore WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Create new milk purchase record
  createMilkPurchase: async ({
    buyerId,
    buyerName,
    milkType,
    buyerPrice,
    totalQty,
    date,
    fatPercentage,
    totalAmount,
  }) => {
    const [result] = await db.execute(
      `INSERT INTO MilkStore (BuyerId, BuyerName, MilkType, BuyerPrice, TotalQty, Date, FatPercentage, TotalAmount) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        buyerId,
        buyerName,
        milkType,
        buyerPrice,
        totalQty,
        date,
        fatPercentage,
        totalAmount,
      ]
    );

    return result.insertId;
  },

  // Get all milk purchases
  getAllMilkPurchases: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkStore WHERE IsDeleted = 0 ORDER BY Date DESC, CreatedAt DESC"
    );
    return rows;
  },

  // Get milk purchases by buyer
  getMilkPurchasesByBuyer: async (buyerId) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkStore WHERE BuyerId = ? AND IsDeleted = 0 ORDER BY Date DESC",
      [buyerId]
    );
    return rows;
  },

  // Get milk purchases by date range
  getMilkPurchasesByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkStore WHERE Date BETWEEN ? AND ? AND IsDeleted = 0 ORDER BY Date DESC",
      [startDate, endDate]
    );
    return rows;
  },

  // Get milk purchases by milk type
  getMilkPurchasesByType: async (milkType) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkStore WHERE MilkType = ? AND IsDeleted = 0 ORDER BY Date DESC",
      [milkType]
    );
    return rows;
  },

  // Update milk purchase
  updateMilkPurchase: async (
    id,
    {
      buyerId,
      buyerName,
      milkType,
      buyerPrice,
      totalQty,
      date,
      fatPercentage,
      totalAmount,
    }
  ) => {
    const [result] = await db.execute(
      `UPDATE MilkStore 
       SET BuyerId = ?, BuyerName = ?, MilkType = ?, BuyerPrice = ?, TotalQty = ?, Date = ?, FatPercentage = ?, TotalAmount = ?
       WHERE Id = ? AND IsDeleted = 0`,
      [
        buyerId,
        buyerName,
        milkType,
        buyerPrice,
        totalQty,
        date,
        fatPercentage,
        totalAmount,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Milk purchase record not found");
    }

    return await MilkStore.findById(id);
  },

  // Soft delete milk purchase
  deleteMilkPurchase: async (id) => {
    const [result] = await db.execute(
      "UPDATE MilkStore SET IsDeleted = 1 WHERE Id = ? AND IsDeleted = 0",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Milk purchase record not found");
    }

    return true;
  },

  // Get milk purchase summary
  getMilkPurchaseSummary: async (startDate = null, endDate = null) => {
    let query = `
      SELECT 
        COUNT(*) as totalTransactions,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(BuyerPrice) as avgPrice,
        MilkType,
        COUNT(DISTINCT BuyerId) as uniqueBuyers
      FROM MilkStore 
      WHERE IsDeleted = 0
    `;
    let params = [];

    if (startDate && endDate) {
      query += " AND Date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    query += " GROUP BY MilkType";

    const [rows] = await db.execute(query, params);
    return rows;
  },

  // Get daily milk purchase report
  getDailyMilkReport: async (date) => {
    const [rows] = await db.execute(
      `SELECT 
        MilkType,
        COUNT(*) as transactions,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(BuyerPrice) as avgPrice,
        MIN(BuyerPrice) as minPrice,
        MAX(BuyerPrice) as maxPrice
      FROM MilkStore 
      WHERE Date = ? AND IsDeleted = 0
      GROUP BY MilkType`,
      [date]
    );
    return rows;
  },

  // Get milk purchases with buyer details
  getMilkPurchasesWithBuyerDetails: async () => {
    const [rows] = await db.execute(
      `SELECT 
        ms.*,
        b.FullName as BuyerFullName,
        b.MobileNumber as BuyerMobile,
        b.City as BuyerCity
      FROM MilkStore ms
      LEFT JOIN Buyers b ON ms.BuyerId = b.Id
      WHERE ms.IsDeleted = 0 AND (b.IsDeleted = 0 OR b.IsDeleted IS NULL)
      ORDER BY ms.Date DESC, ms.CreatedAt DESC`
    );
    return rows;
  },

  // Search milk purchases
  searchMilkPurchases: async (searchTerm) => {
    const [rows] = await db.execute(
      `SELECT ms.*, b.FullName, b.MobileNumber, b.City
       FROM MilkStore ms
       LEFT JOIN Buyers b ON ms.BuyerId = b.Id
       WHERE (ms.BuyerName LIKE ? OR b.FullName LIKE ? OR b.MobileNumber LIKE ?) 
       AND ms.IsDeleted = 0 AND (b.IsDeleted = 0 OR b.IsDeleted IS NULL)
       ORDER BY ms.Date DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  },
};

module.exports = MilkStore;
