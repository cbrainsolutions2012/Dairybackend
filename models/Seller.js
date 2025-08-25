const { db } = require("../config/database");

const Seller = {
  // Find seller by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM Sellers WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Find seller by mobile number
  findByMobile: async (mobileNumber) => {
    const [rows] = await db.execute(
      "SELECT * FROM Sellers WHERE MobileNumber = ? AND IsDeleted = 0",
      [mobileNumber]
    );
    return rows[0];
  },

  // Create new seller
  createSeller: async ({ fullName, mobileNumber, city }) => {
    // Check if mobile number already exists
    const existingSeller = await Seller.findByMobile(mobileNumber);
    if (existingSeller) {
      throw new Error("Mobile number already exists");
    }

    const [result] = await db.execute(
      "INSERT INTO Sellers (FullName, MobileNumber, City) VALUES (?, ?, ?)",
      [fullName, mobileNumber, city]
    );

    return result.insertId;
  },

  // Update seller
  updateSeller: async (id, { fullName, mobileNumber, city }) => {
    // Check if mobile number exists for other sellers
    const existingSeller = await Seller.findByMobile(mobileNumber);
    if (existingSeller && existingSeller.Id !== parseInt(id)) {
      throw new Error("Mobile number already exists");
    }

    const [result] = await db.execute(
      "UPDATE Sellers SET FullName = ?, MobileNumber = ?, City = ? WHERE Id = ? AND IsDeleted = 0",
      [fullName, mobileNumber, city, id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Seller not found");
    }

    return await Seller.findById(id);
  },

  // Get all sellers
  getAllSellers: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM Sellers WHERE IsDeleted = 0 ORDER BY CreatedAt DESC"
    );
    return rows;
  },

  // Search sellers by name or mobile
  searchSellers: async (searchTerm) => {
    const [rows] = await db.execute(
      "SELECT * FROM Sellers WHERE (FullName LIKE ? OR MobileNumber LIKE ?) AND IsDeleted = 0 ORDER BY FullName",
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  },

  // Get sellers by city
  getSellersByCity: async (city) => {
    const [rows] = await db.execute(
      "SELECT * FROM Sellers WHERE City = ? AND IsDeleted = 0 ORDER BY FullName",
      [city]
    );
    return rows;
  },

  // Soft delete seller
  deleteSeller: async (id) => {
    const [result] = await db.execute(
      "UPDATE Sellers SET IsDeleted = 1 WHERE Id = ? AND IsDeleted = 0",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Seller not found");
    }

    return true;
  },

  // Get seller count
  getSellerCount: async () => {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM Sellers WHERE IsDeleted = 0"
    );
    return rows[0].count;
  },

  // Check if mobile number exists
  mobileExists: async (mobileNumber, excludeId = null) => {
    let query =
      "SELECT COUNT(*) as count FROM Sellers WHERE MobileNumber = ? AND IsDeleted = 0";
    let params = [mobileNumber];

    if (excludeId) {
      query += " AND Id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].count > 0;
  },

  // Get seller with milk transactions summary
  getSellerWithTransactions: async (id) => {
    const seller = await Seller.findById(id);
    if (!seller) return null;

    // Get milk distribution summary
    const [milkSummary] = await db.execute(
      `SELECT 
        COUNT(*) as totalTransactions,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(SellerPrice) as avgPrice
      FROM MilkDistribution 
      WHERE SellerId = ? AND IsDeleted = 0`,
      [id]
    );

    // Get payment summary
    const [paymentSummary] = await db.execute(
      `SELECT 
        COUNT(*) as totalPayments,
        SUM(PaymentAmount) as totalPaid
      FROM SellerPayments 
      WHERE SellerId = ? AND IsDeleted = 0`,
      [id]
    );

    return {
      ...seller,
      milkTransactions: milkSummary[0],
      payments: paymentSummary[0],
      outstandingAmount:
        (milkSummary[0].totalAmount || 0) - (paymentSummary[0].totalPaid || 0),
    };
  },
};

module.exports = Seller;
