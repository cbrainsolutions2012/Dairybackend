const { db } = require("../config/database");

const MilkDistribution = {
  // Find milk distribution record by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkDistribution WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Create new milk sale record
  createMilkSale: async ({
    sellerId,
    sellerName,
    milkType,
    sellerPrice,
    totalQty,
    date,
    fatPercentage,
    totalAmount,
  }) => {
    const [result] = await db.execute(
      `INSERT INTO MilkDistribution (SellerId, SellerName, MilkType, SellerPrice, TotalQty, Date, FatPercentage, TotalAmount) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sellerId,
        sellerName,
        milkType,
        sellerPrice,
        totalQty,
        date,
        fatPercentage,
        totalAmount,
      ]
    );

    return result.insertId;
  },

  // Get all milk sales
  getAllMilkSales: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkDistribution WHERE IsDeleted = 0 ORDER BY Date DESC, CreatedAt DESC"
    );
    return rows;
  },

  // Get milk sales by seller
  getMilkSalesBySeller: async (sellerId) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkDistribution WHERE SellerId = ? AND IsDeleted = 0 ORDER BY Date DESC",
      [sellerId]
    );
    return rows;
  },

  // Get milk sales by date range
  getMilkSalesByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkDistribution WHERE Date BETWEEN ? AND ? AND IsDeleted = 0 ORDER BY Date DESC",
      [startDate, endDate]
    );
    return rows;
  },

  // Get milk sales by milk type
  getMilkSalesByType: async (milkType) => {
    const [rows] = await db.execute(
      "SELECT * FROM MilkDistribution WHERE MilkType = ? AND IsDeleted = 0 ORDER BY Date DESC",
      [milkType]
    );
    return rows;
  },

  // Update milk sale
  updateMilkSale: async (
    id,
    {
      sellerId,
      sellerName,
      milkType,
      sellerPrice,
      totalQty,
      date,
      fatPercentage,
      totalAmount,
    }
  ) => {
    const [result] = await db.execute(
      `UPDATE MilkDistribution 
       SET SellerId = ?, SellerName = ?, MilkType = ?, SellerPrice = ?, TotalQty = ?, Date = ?, FatPercentage = ?, TotalAmount = ?
       WHERE Id = ? AND IsDeleted = 0`,
      [
        sellerId,
        sellerName,
        milkType,
        sellerPrice,
        totalQty,
        date,
        fatPercentage,
        totalAmount,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Milk sale record not found");
    }

    return await MilkDistribution.findById(id);
  },

  // Soft delete milk sale
  deleteMilkSale: async (id) => {
    const [result] = await db.execute(
      "UPDATE MilkDistribution SET IsDeleted = 1 WHERE Id = ? AND IsDeleted = 0",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Milk sale record not found");
    }

    return true;
  },

  // Get milk sales summary
  getMilkSalesSummary: async (startDate = null, endDate = null) => {
    let query = `
      SELECT 
        COUNT(*) as totalTransactions,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(SellerPrice) as avgPrice,
        MilkType,
        COUNT(DISTINCT SellerId) as uniqueSellers
      FROM MilkDistribution 
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

  // Get daily milk sales report
  getDailyMilkSalesReport: async (date) => {
    const [rows] = await db.execute(
      `SELECT 
        MilkType,
        COUNT(*) as transactions,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(SellerPrice) as avgPrice,
        MIN(SellerPrice) as minPrice,
        MAX(SellerPrice) as maxPrice
      FROM MilkDistribution 
      WHERE Date = ? AND IsDeleted = 0
      GROUP BY MilkType`,
      [date]
    );
    return rows;
  },

  // Get milk sales with seller details
  getMilkSalesWithSellerDetails: async () => {
    const [rows] = await db.execute(
      `SELECT 
        md.*,
        s.FullName as SellerFullName,
        s.MobileNumber as SellerMobile,
        s.City as SellerCity
      FROM MilkDistribution md
      LEFT JOIN Sellers s ON md.SellerId = s.Id
      WHERE md.IsDeleted = 0 AND (s.IsDeleted = 0 OR s.IsDeleted IS NULL)
      ORDER BY md.Date DESC, md.CreatedAt DESC`
    );
    return rows;
  },

  // Search milk sales
  searchMilkSales: async (searchTerm) => {
    const [rows] = await db.execute(
      `SELECT md.*, s.FullName, s.MobileNumber, s.City
       FROM MilkDistribution md
       LEFT JOIN Sellers s ON md.SellerId = s.Id
       WHERE (md.SellerName LIKE ? OR s.FullName LIKE ? OR s.MobileNumber LIKE ?) 
       AND md.IsDeleted = 0 AND (s.IsDeleted = 0 OR s.IsDeleted IS NULL)
       ORDER BY md.Date DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  },

  // Get profit analysis (milk sales vs purchases)
  getProfitAnalysis: async (startDate = null, endDate = null) => {
    let dateFilter = "";
    let params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE Date BETWEEN ? AND ?";
      params = [startDate, endDate, startDate, endDate];
    }

    const [rows] = await db.execute(
      `SELECT 
        'Sales' as type,
        MilkType,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(SellerPrice) as avgPrice
      FROM MilkDistribution 
      ${dateFilter} AND IsDeleted = 0
      GROUP BY MilkType
      
      UNION ALL
      
      SELECT 
        'Purchases' as type,
        MilkType,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(BuyerPrice) as avgPrice
      FROM MilkStore 
      ${dateFilter} AND IsDeleted = 0
      GROUP BY MilkType
      
      ORDER BY MilkType, type`,
      params
    );
    return rows;
  },
};

module.exports = MilkDistribution;
