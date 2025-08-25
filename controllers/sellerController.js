const Seller = require("../models/Seller");

const sellerController = {
  // Create new seller
  createSeller: async (req, res) => {
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

      const sellerId = await Seller.createSeller({
        fullName,
        mobileNumber,
        city,
      });
      const newSeller = await Seller.findById(sellerId);

      res.status(201).json({
        success: true,
        message: "Seller created successfully",
        data: {
          seller: newSeller,
        },
      });
    } catch (error) {
      console.error("Create seller error:", error);

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

  // Get all sellers
  getAllSellers: async (req, res) => {
    try {
      const { city, search } = req.query;

      let sellers;
      let total;

      if (search) {
        sellers = await Seller.searchSellers(search);
        total = sellers.length;
      } else if (city) {
        sellers = await Seller.getSellersByCity(city);
        total = sellers.length;
      } else {
        sellers = await Seller.getAllSellers();
        total = await Seller.getSellerCount();
      }

      res.json({
        success: true,
        data: {
          sellers: sellers,
          total: total,
        },
      });
    } catch (error) {
      console.error("Get all sellers error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get seller by ID
  getSellerById: async (req, res) => {
    try {
      const { id } = req.params;
      const { includeTransactions } = req.query;

      let seller;

      if (includeTransactions === "true") {
        seller = await Seller.getSellerWithTransactions(id);
      } else {
        seller = await Seller.findById(id);
      }

      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      res.json({
        success: true,
        data: {
          seller: seller,
        },
      });
    } catch (error) {
      console.error("Get seller by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Update seller
  updateSeller: async (req, res) => {
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

      const updatedSeller = await Seller.updateSeller(id, {
        fullName,
        mobileNumber,
        city,
      });

      res.json({
        success: true,
        message: "Seller updated successfully",
        data: {
          seller: updatedSeller,
        },
      });
    } catch (error) {
      console.error("Update seller error:", error);

      if (error.message === "Seller not found") {
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

  // Delete seller
  deleteSeller: async (req, res) => {
    try {
      const { id } = req.params;

      await Seller.deleteSeller(id);

      res.json({
        success: true,
        message: "Seller deleted successfully",
      });
    } catch (error) {
      console.error("Delete seller error:", error);

      if (error.message === "Seller not found") {
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

  // Search sellers
  searchSellers: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Search term must be at least 2 characters",
        });
      }

      const sellers = await Seller.searchSellers(q.trim());

      res.json({
        success: true,
        data: {
          sellers: sellers,
          total: sellers.length,
        },
      });
    } catch (error) {
      console.error("Search sellers error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = sellerController;
