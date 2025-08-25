const Buyer = require("../models/Buyer");

const buyerController = {
  // Create new buyer
  createBuyer: async (req, res) => {
    try {
      const { fullName, mobileNumber, city } = req.body;

      // Validation
      if (!fullName || !mobileNumber || !city) {
        return res.status(400).json({
          success: false,
          message: "Full name, mobile number, and city are required",
        });
      }

      // Validate mobile number format (basic validation)
      if (!/^\d{10}$/.test(mobileNumber)) {
        return res.status(400).json({
          success: false,
          message: "Mobile number must be 10 digits",
        });
      }

      const buyerId = await Buyer.createBuyer({ fullName, mobileNumber, city });
      const newBuyer = await Buyer.findById(buyerId);

      res.status(201).json({
        success: true,
        message: "Buyer created successfully",
        data: {
          buyer: newBuyer,
        },
      });
    } catch (error) {
      console.error("Create buyer error:", error);

      if (error.message === "Mobile number already exists") {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get all buyers
  getAllBuyers: async (req, res) => {
    try {
      const { city, search } = req.query;

      let buyers;
      let total;

      if (search) {
        buyers = await Buyer.searchBuyers(search);
        total = buyers.length;
      } else if (city) {
        buyers = await Buyer.getBuyersByCity(city);
        total = buyers.length;
      } else {
        buyers = await Buyer.getAllBuyers();
        total = await Buyer.getBuyerCount();
      }

      res.json({
        success: true,
        data: {
          buyers: buyers,
          total: total,
        },
      });
    } catch (error) {
      console.error("Get all buyers error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get buyer by ID
  getBuyerById: async (req, res) => {
    try {
      const { id } = req.params;
      const { includeTransactions } = req.query;

      let buyer;

      if (includeTransactions === "true") {
        buyer = await Buyer.getBuyerWithTransactions(id);
      } else {
        buyer = await Buyer.findById(id);
      }

      if (!buyer) {
        return res.status(404).json({
          success: false,
          message: "Buyer not found",
        });
      }

      res.json({
        success: true,
        data: {
          buyer: buyer,
        },
      });
    } catch (error) {
      console.error("Get buyer by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Update buyer
  updateBuyer: async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, mobileNumber, city } = req.body;

      // Validation
      if (!fullName || !mobileNumber || !city) {
        return res.status(400).json({
          success: false,
          message: "Full name, mobile number, and city are required",
        });
      }

      // Validate mobile number format
      if (!/^\d{10}$/.test(mobileNumber)) {
        return res.status(400).json({
          success: false,
          message: "Mobile number must be 10 digits",
        });
      }

      const updatedBuyer = await Buyer.updateBuyer(id, {
        fullName,
        mobileNumber,
        city,
      });

      res.json({
        success: true,
        message: "Buyer updated successfully",
        data: {
          buyer: updatedBuyer,
        },
      });
    } catch (error) {
      console.error("Update buyer error:", error);

      if (error.message === "Buyer not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === "Mobile number already exists") {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Delete buyer
  deleteBuyer: async (req, res) => {
    try {
      const { id } = req.params;

      await Buyer.deleteBuyer(id);

      res.json({
        success: true,
        message: "Buyer deleted successfully",
      });
    } catch (error) {
      console.error("Delete buyer error:", error);

      if (error.message === "Buyer not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Search buyers
  searchBuyers: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Search term must be at least 2 characters",
        });
      }

      const buyers = await Buyer.searchBuyers(q.trim());

      res.json({
        success: true,
        data: {
          buyers: buyers,
          total: buyers.length,
        },
      });
    } catch (error) {
      console.error("Search buyers error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = buyerController;
