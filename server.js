const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { swaggerUi, specs } = require("./config/swagger");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

//Load environment variables FIRST
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

// Import database AFTER environment variables are loaded
const { testConnection } = require("./config/database");

const app = express();

// Swagger Documentation - Put before other middleware to avoid conflicts
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customSiteTitle: "Milk Dairy API Documentation"
}));

// Swagger JSON endpoint
app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple API docs test endpoint
app.get("/docs-test", (req, res) => {
  res.send(`
    <html>
      <head><title>API Docs Test</title></head>
      <body>
        <h1>API Documentation Test</h1>
        <p>If you can see this, the server is working.</p>
        <p><a href="/api-docs">Go to Swagger UI</a></p>
        <p><a href="/api-docs/swagger.json">View Swagger JSON</a></p>
      </body>
    </html>
  `);
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Milk Dairy API",
    documentation: "Visit /api-docs for API documentation",
    status: "success",
  });
});

// Authentication routes
app.use("/api/auth", require("./routes/auth"));

// Buyer routes
app.use("/api/buyers", require("./routes/buyers"));

// Seller routes
app.use("/api/sellers", require("./routes/sellers"));

// Milk Store routes (Milk Purchases)
app.use("/api/milk-store", require("./routes/milkStore"));

// Milk Distribution routes (Milk Sales)
app.use("/api/milk-distribution", require("./routes/milkDistribution"));

// Buyer Payment routes
app.use("/api/buyer-payments", require("./routes/buyerPayments"));

// Seller Payment routes
app.use("/api/seller-payments", require("./routes/sellerPayments"));

// Income routes
app.use("/api/income", require("./routes/income"));

// Expense routes
app.use("/api/expense", require("./routes/expense"));

// Dashboard routes
app.use("/api/dashboard", require("./routes/dashboard"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    status: statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log(`Server is running on port ${PORT}`);
  } else {
    console.error("Failed to connect to the database. Server not started.");
    process.exit(1); // Exit the process with failure
  }
});
