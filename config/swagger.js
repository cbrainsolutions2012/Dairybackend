const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Milk Dairy Management System API",
      version: "1.0.0",
      description: `
        A comprehensive Node.js backend API for managing milk dairy operations with automated accounting, 
        real-time analytics, and complete business intelligence.
        
        ## Features
        - **Automated Accounting**: Database triggers automatically create financial records
        - **Real-time Analytics**: Live profit/loss and business intelligence
        - **Complete CRUD**: Full operations for buyers, sellers, milk transactions, and payments
        - **Secure Authentication**: JWT-based authentication system
        - **Business Intelligence**: Comprehensive dashboard and reporting
        
        ## Authentication
        Most endpoints require authentication. Use the login endpoint to get a JWT token, 
        then include it in the Authorization header as: \`Bearer YOUR_JWT_TOKEN\`
      `,
      contact: {
        name: "CBrain Solutions",
        email: "support@cbrainsolutions.com",
        url: "https://github.com/cbrainsolutions2012/Dairybackend",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://your-production-domain.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from login",
        },
      },
      schemas: {
        // User schemas
        User: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            Username: { type: "string", example: "john_doe" },
            Email: { type: "string", example: "john@example.com" },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "john_doe" },
            password: { type: "string", example: "password123" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "john_doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "password123" },
          },
        },

        // Buyer schemas
        Buyer: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            Name: { type: "string", example: "Ramesh Kumar" },
            MobileNumber: { type: "string", example: "9876543210" },
            City: { type: "string", example: "Mumbai" },
            Address: { type: "string", example: "123 Main Street, Mumbai" },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
          },
        },
        BuyerRequest: {
          type: "object",
          required: ["name", "mobileNumber", "city"],
          properties: {
            name: { type: "string", example: "Ramesh Kumar" },
            mobileNumber: { type: "string", example: "9876543210" },
            city: { type: "string", example: "Mumbai" },
            address: { type: "string", example: "123 Main Street, Mumbai" },
          },
        },

        // Seller schemas
        Seller: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            Name: { type: "string", example: "Suresh Patel" },
            MobileNumber: { type: "string", example: "9876543211" },
            City: { type: "string", example: "Delhi" },
            Address: { type: "string", example: "456 Market Road, Delhi" },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
          },
        },
        SellerRequest: {
          type: "object",
          required: ["name", "mobileNumber", "city"],
          properties: {
            name: { type: "string", example: "Suresh Patel" },
            mobileNumber: { type: "string", example: "9876543211" },
            city: { type: "string", example: "Delhi" },
            address: { type: "string", example: "456 Market Road, Delhi" },
          },
        },

        // Milk Store schemas
        MilkStore: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            BuyerId: { type: "integer", example: 1 },
            BuyerName: { type: "string", example: "Ramesh Kumar" },
            MilkType: {
              type: "string",
              enum: ["cow", "buffalo"],
              example: "cow",
            },
            BuyerPrice: { type: "number", format: "decimal", example: 45.5 },
            TotalQty: { type: "number", format: "decimal", example: 100.0 },
            Date: { type: "string", format: "date", example: "2025-08-25" },
            FatPercentage: { type: "number", format: "decimal", example: 3.5 },
            TotalAmount: { type: "number", format: "decimal", example: 4550.0 },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
          },
        },
        MilkPurchaseRequest: {
          type: "object",
          required: [
            "buyerId",
            "milkType",
            "buyerPrice",
            "totalQty",
            "date",
            "fatPercentage",
          ],
          properties: {
            buyerId: { type: "integer", example: 1 },
            milkType: {
              type: "string",
              enum: ["cow", "buffalo"],
              example: "cow",
            },
            buyerPrice: { type: "number", format: "decimal", example: 45.5 },
            totalQty: { type: "number", format: "decimal", example: 100.0 },
            date: { type: "string", format: "date", example: "2025-08-25" },
            fatPercentage: { type: "number", format: "decimal", example: 3.5 },
          },
        },

        // Milk Distribution schemas
        MilkDistribution: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            SellerId: { type: "integer", example: 1 },
            SellerName: { type: "string", example: "Suresh Patel" },
            MilkType: {
              type: "string",
              enum: ["cow", "buffalo"],
              example: "cow",
            },
            SellerPrice: { type: "number", format: "decimal", example: 48.0 },
            TotalQty: { type: "number", format: "decimal", example: 90.0 },
            Date: { type: "string", format: "date", example: "2025-08-25" },
            FatPercentage: { type: "number", format: "decimal", example: 3.5 },
            TotalAmount: { type: "number", format: "decimal", example: 4320.0 },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
          },
        },
        MilkSaleRequest: {
          type: "object",
          required: [
            "sellerId",
            "milkType",
            "sellerPrice",
            "totalQty",
            "date",
            "fatPercentage",
          ],
          properties: {
            sellerId: { type: "integer", example: 1 },
            milkType: {
              type: "string",
              enum: ["cow", "buffalo"],
              example: "cow",
            },
            sellerPrice: { type: "number", format: "decimal", example: 48.0 },
            totalQty: { type: "number", format: "decimal", example: 90.0 },
            date: { type: "string", format: "date", example: "2025-08-25" },
            fatPercentage: { type: "number", format: "decimal", example: 3.5 },
          },
        },

        // Payment schemas
        BuyerPayment: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            BuyerId: { type: "integer", example: 1 },
            BuyerName: { type: "string", example: "Ramesh Kumar" },
            PaymentAmount: {
              type: "number",
              format: "decimal",
              example: 1000.0,
            },
            PaymentType: {
              type: "string",
              enum: ["advance", "full", "partial"],
              example: "advance",
            },
            PaymentMethod: {
              type: "string",
              enum: ["cash", "bank_transfer", "upi", "cheque"],
              example: "upi",
            },
            TransactionId: { type: "string", example: "TXN123456789" },
            Notes: { type: "string", example: "Payment for August milk" },
            Date: { type: "string", format: "date", example: "2025-08-25" },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
          },
        },
        BuyerPaymentRequest: {
          type: "object",
          required: [
            "buyerId",
            "paymentAmount",
            "paymentType",
            "paymentMethod",
            "date",
          ],
          properties: {
            buyerId: { type: "integer", example: 1 },
            paymentAmount: {
              type: "number",
              format: "decimal",
              example: 1000.0,
            },
            paymentType: {
              type: "string",
              enum: ["advance", "full", "partial"],
              example: "advance",
            },
            paymentMethod: {
              type: "string",
              enum: ["cash", "bank_transfer", "upi", "cheque"],
              example: "upi",
            },
            transactionId: { type: "string", example: "TXN123456789" },
            notes: { type: "string", example: "Payment for August milk" },
            date: { type: "string", format: "date", example: "2025-08-25" },
          },
        },

        // Financial schemas
        Income: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            Amount: { type: "number", format: "decimal", example: 1000.0 },
            Description: {
              type: "string",
              example: "Milk sale - 90L cow milk @ ₹48.00/L",
            },
            Source: { type: "string", example: "Suresh Patel" },
            Date: { type: "string", format: "date", example: "2025-08-25" },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
            MilkDistributionId: { type: "integer", example: 1 },
          },
        },
        Expense: {
          type: "object",
          properties: {
            Id: { type: "integer", example: 1 },
            Amount: { type: "number", format: "decimal", example: 455.0 },
            Description: {
              type: "string",
              example: "Milk purchase - 10L cow milk @ ₹45.50/L",
            },
            PaidTo: { type: "string", example: "Ramesh Kumar" },
            Category: { type: "string", example: "milk_purchase" },
            Date: { type: "string", format: "date", example: "2025-08-25" },
            CreatedAt: { type: "string", format: "date-time" },
            IsDeleted: { type: "integer", example: 0 },
            MilkStoreId: { type: "integer", example: 1 },
          },
        },

        // Dashboard schemas
        FinancialOverview: {
          type: "object",
          properties: {
            summary: {
              type: "object",
              properties: {
                totalIncome: { type: "number", example: 10000.0 },
                totalExpense: { type: "number", example: 8000.0 },
                netProfit: { type: "number", example: 2000.0 },
                profitMargin: { type: "string", example: "20.00" },
              },
            },
            incomeBreakdown: { type: "array", items: { type: "object" } },
            expenseBreakdown: { type: "array", items: { type: "object" } },
          },
        },

        // Response schemas
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error occurred" },
            error: { type: "string", example: "Detailed error message" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/User" },
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization",
      },
      {
        name: "Buyers",
        description: "Customer management and operations",
      },
      {
        name: "Sellers",
        description: "Supplier management and operations",
      },
      {
        name: "Milk Store", 
        description: "Milk purchase tracking and inventory management",
      },
      {
        name: "Milk Distribution",
        description: "Milk sales and distribution operations",
      },
      {
        name: "Buyer Payments",
        description: "Customer payment management and tracking",
      },
      {
        name: "Seller Payments", 
        description: "Supplier payment management and tracking",
      },
      {
        name: "Income",
        description: "Revenue tracking and income management",
      },
      {
        name: "Expenses",
        description: "Cost tracking and expense management", 
      },
      {
        name: "Dashboard",
        description: "Analytics, reports and business intelligence",
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
