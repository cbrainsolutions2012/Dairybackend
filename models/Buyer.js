const { db } = require("../config/database");

const Buyer = {
  // Find buyer by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM Buyers WHERE Id = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  },

  // Find buyer by mobile number
  findByMobile: async (mobileNumber) => {
    const [rows] = await db.execute(
      "SELECT * FROM Buyers WHERE MobileNumber = ? AND IsDeleted = 0",
      [mobileNumber]
    );
    return rows[0];
  },

  // Create new buyer
  createBuyer: async ({ fullName, mobileNumber, city }) => {
    // Check if mobile number already exists
    const existingBuyer = await Buyer.findByMobile(mobileNumber);
    if (existingBuyer) {
      throw new Error("Mobile number already exists");
    }

    const [result] = await db.execute(
      "INSERT INTO Buyers (FullName, MobileNumber, City) VALUES (?, ?, ?)",
      [fullName, mobileNumber, city]
    );

    return result.insertId;
  },

  // Update buyer
  updateBuyer: async (id, { fullName, mobileNumber, city }) => {
    // Check if mobile number exists for other buyers
    const existingBuyer = await Buyer.findByMobile(mobileNumber);
    if (existingBuyer && existingBuyer.Id !== parseInt(id)) {
      throw new Error("Mobile number already exists");
    }

    const [result] = await db.execute(
      "UPDATE Buyers SET FullName = ?, MobileNumber = ?, City = ? WHERE Id = ? AND IsDeleted = 0",
      [fullName, mobileNumber, city, id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Buyer not found");
    }

    return await Buyer.findById(id);
  },

  // Get all buyers
  getAllBuyers: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM Buyers WHERE IsDeleted = 0 ORDER BY CreatedAt DESC"
    );
    return rows;
  },

  // Search buyers by name or mobile
  searchBuyers: async (searchTerm) => {
    const [rows] = await db.execute(
      "SELECT * FROM Buyers WHERE (FullName LIKE ? OR MobileNumber LIKE ?) AND IsDeleted = 0 ORDER BY FullName",
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  },

  // Get buyers by city
  getBuyersByCity: async (city) => {
    const [rows] = await db.execute(
      "SELECT * FROM Buyers WHERE City = ? AND IsDeleted = 0 ORDER BY FullName",
      [city]
    );
    return rows;
  },

  // Soft delete buyer
  deleteBuyer: async (id) => {
    const [result] = await db.execute(
      "UPDATE Buyers SET IsDeleted = 1 WHERE Id = ? AND IsDeleted = 0",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Buyer not found");
    }

    return true;
  },

  // Get buyer count
  getBuyerCount: async () => {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM Buyers WHERE IsDeleted = 0"
    );
    return rows[0].count;
  },

  // Check if mobile number exists
  mobileExists: async (mobileNumber, excludeId = null) => {
    let query =
      "SELECT COUNT(*) as count FROM Buyers WHERE MobileNumber = ? AND IsDeleted = 0";
    let params = [mobileNumber];

    if (excludeId) {
      query += " AND Id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].count > 0;
  },

  // Get buyer with milk transactions summary
  getBuyerWithTransactions: async (id) => {
    const buyer = await Buyer.findById(id);
    if (!buyer) return null;

    // Get milk purchase summary
    const [milkSummary] = await db.execute(
      `SELECT 
        COUNT(*) as totalTransactions,
        SUM(TotalQty) as totalQuantity,
        SUM(TotalAmount) as totalAmount,
        AVG(BuyerPrice) as avgPrice
      FROM MilkStore 
      WHERE BuyerId = ? AND IsDeleted = 0`,
      [id]
    );

    // Get payment summary
    const [paymentSummary] = await db.execute(
      `SELECT 
        COUNT(*) as totalPayments,
        SUM(PaymentAmount) as totalPaid
      FROM BuyerPayments 
      WHERE BuyerId = ? AND IsDeleted = 0`,
      [id]
    );

    return {
      ...buyer,
      milkTransactions: milkSummary[0],
      payments: paymentSummary[0],
      outstandingAmount:
        (milkSummary[0].totalAmount || 0) - (paymentSummary[0].totalPaid || 0),
    };
  },
};

module.exports = Buyer;
