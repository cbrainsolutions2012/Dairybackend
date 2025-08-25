# 🥛 Milk Dairy Management System - Backend API

A comprehensive Node.js backend API for managing milk dairy operations with automated accounting, real-time analytics, and complete business intelligence.

## API Documentation

The API includes comprehensive interactive documentation powered by Swagger UI. Once the server is running, you can access it at:

**🌐 Swagger UI: http://localhost:3000/api-docs**

### Features of the API Documentation:

- **Interactive Testing**: Test all API endpoints directly from the browser
- **Authentication Support**: Built-in JWT token authentication
- **Request/Response Examples**: Complete with sample data
- **Schema Definitions**: Detailed data models for all entities
- **Error Response Documentation**: Standard error formats and codes

### Using the API Documentation:

1. Start the server (`npm start`)
2. Navigate to http://localhost:3000/api-docs
3. Authenticate using the login endpoint to get a JWT token
4. Use the "Authorize" button to add your Bearer token
5. Test any endpoint with real data

### Quick API Reference:

| Module            | Endpoint Base           | Description                                  |
| ----------------- | ----------------------- | -------------------------------------------- |
| Authentication    | `/api/auth`             | User registration, login, profile management |
| Buyers            | `/api/buyers`           | Customer management and search               |
| Sellers           | `/api/sellers`          | Supplier management and search               |
| Milk Store        | `/api/milkstore`        | Milk purchase tracking and reports           |
| Milk Distribution | `/api/milkdistribution` | Milk sales tracking and analytics            |
| Buyer Payments    | `/api/buyerpayments`    | Customer payment management                  |
| Seller Payments   | `/api/sellerpayments`   | Supplier payment management                  |
| Income            | `/api/income`           | Income tracking and categorization           |
| Expenses          | `/api/expense`          | Expense management and analytics             |
| Dashboard         | `/api/dashboard`        | Business analytics and insights              |

## Getting Started

### **Core Business Operations**

- ✅ **Authentication System** - JWT-based user authentication
- ✅ **Buyer Management** - Manage milk suppliers with full CRUD operations
- ✅ **Seller Management** - Manage milk distributors with full CRUD operations
- ✅ **Milk Purchase System** - Record and track milk purchases from buyers
- ✅ **Milk Sales System** - Record and track milk sales to sellers

### **Payment Management**

- ✅ **Buyer Payments** - Track payments received from customers
- ✅ **Seller Payments** - Track payments made to suppliers
- ✅ **Payment Analytics** - Detailed payment method and type analysis

### **Automated Financial Management**

- ✅ **Income Tracking** - Automatic income recording via database triggers
- ✅ **Expense Tracking** - Automatic expense recording via database triggers
- ✅ **Financial Synchronization** - UPDATE/DELETE operations sync financial records
- ✅ **Real-time Accounting** - Zero manual financial entry required

### **Business Intelligence & Analytics**

- ✅ **Financial Dashboard** - Complete profit/loss overview
- ✅ **Milk Business Analytics** - Purchase vs sales analysis with profit margins
- ✅ **Payment Analytics** - Payment method and type breakdowns
- ✅ **Daily/Monthly Reports** - Detailed trends and summaries
- ✅ **Category Analysis** - Income and expense categorization

## 🛠 Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL with automated triggers
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, bcryptjs password hashing
- **Performance**: Compression middleware
- **Logging**: Morgan
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/cbrainsolutions2012/Dairybackend.git
cd Dairybackend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=milk_dairy
```

### 4. Database Setup

Run the SQL schema file to create tables and triggers:

```bash
mysql -h your_host -u your_user -p your_database < milk_dairy.sql
```

### 5. Start the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### **Authentication**

```bash
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### **Buyer Management**

```bash
GET    /api/buyers         # List all buyers
POST   /api/buyers         # Create new buyer
GET    /api/buyers/:id     # Get specific buyer
PUT    /api/buyers/:id     # Update buyer
DELETE /api/buyers/:id     # Delete buyer
GET    /api/buyers/search  # Search buyers
```

### **Seller Management**

```bash
GET    /api/sellers        # List all sellers
POST   /api/sellers        # Create new seller
GET    /api/sellers/:id    # Get specific seller
PUT    /api/sellers/:id    # Update seller
DELETE /api/sellers/:id    # Delete seller
GET    /api/sellers/search # Search sellers
```

### **Milk Operations**

```bash
# Milk Purchases
GET    /api/milk-store                    # List all milk purchases
POST   /api/milk-store                    # Record new milk purchase
GET    /api/milk-store/:id               # Get specific purchase
PUT    /api/milk-store/:id               # Update milk purchase
DELETE /api/milk-store/:id               # Delete milk purchase
GET    /api/milk-store/search            # Search purchases

# Milk Sales
GET    /api/milk-distribution            # List all milk sales
POST   /api/milk-distribution            # Record new milk sale
GET    /api/milk-distribution/:id        # Get specific sale
PUT    /api/milk-distribution/:id        # Update milk sale
DELETE /api/milk-distribution/:id        # Delete milk sale
GET    /api/milk-distribution/search     # Search sales
```

### **Payment Management**

```bash
# Buyer Payments (Money Received)
GET    /api/buyer-payments               # List payments received
POST   /api/buyer-payments               # Record payment received
GET    /api/buyer-payments/:id           # Get specific payment
PUT    /api/buyer-payments/:id           # Update payment
DELETE /api/buyer-payments/:id           # Delete payment

# Seller Payments (Money Paid)
GET    /api/seller-payments              # List payments made
POST   /api/seller-payments              # Record payment made
GET    /api/seller-payments/:id          # Get specific payment
PUT    /api/seller-payments/:id          # Update payment
DELETE /api/seller-payments/:id          # Delete payment
```

### **Financial Tracking**

```bash
# Income Management
GET    /api/income                       # View all income
GET    /api/income/date-range            # Income by date range
GET    /api/income/categories            # Income by category
POST   /api/income                       # Manual income entry

# Expense Management
GET    /api/expense                      # View all expenses
GET    /api/expense/date-range           # Expenses by date range
GET    /api/expense/categories           # Expense categories
POST   /api/expense                      # Manual expense entry
```

### **Analytics & Dashboard**

```bash
GET /api/dashboard/financial-overview    # Complete financial summary
GET /api/dashboard/milk-analytics        # Milk business analysis
GET /api/dashboard/payment-analytics     # Payment analysis
GET /api/dashboard/daily-profit-loss/:date           # Daily P&L
GET /api/dashboard/monthly-trends/:year/:month       # Monthly trends
```

## 🔧 Database Features

### **Automated Triggers**

The system includes sophisticated database triggers for automatic financial management:

- **Milk Purchase → Expense**: Automatically creates expense when milk is purchased
- **Milk Sale → Income**: Automatically creates income when milk is sold
- **Buyer Payment → Income**: Automatically creates income when payment is received
- **Seller Payment → Expense**: Automatically creates expense when payment is made
- **UPDATE Synchronization**: Updates financial records when transactions are modified
- **DELETE Synchronization**: Soft deletes financial records when transactions are deleted

### **Data Integrity**

- Reference-based linking between transactions and financial records
- Bulletproof UPDATE/DELETE synchronization
- Soft delete functionality for audit trail preservation

## 🎯 Example API Usage

### Record a Milk Purchase

```bash
curl -X POST http://localhost:3000/api/milk-store \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "buyerId": 1,
    "milkType": "cow",
    "buyerPrice": 45.50,
    "totalQty": 100,
    "date": "2025-08-25",
    "fatPercentage": 3.5
  }'
```

_This automatically creates an expense entry in the financial system_

### Record a Milk Sale

```bash
curl -X POST http://localhost:3000/api/milk-distribution \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sellerId": 1,
    "milkType": "cow",
    "sellerPrice": 48.00,
    "totalQty": 100,
    "date": "2025-08-25",
    "fatPercentage": 3.5
  }'
```

_This automatically creates an income entry in the financial system_

### Get Financial Overview

```bash
curl -X GET "http://localhost:3000/api/dashboard/financial-overview?startDate=2025-08-01&endDate=2025-08-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

- JWT-based authentication for all protected routes
- Password hashing using bcryptjs
- Helmet.js for security headers
- CORS enabled for cross-origin requests
- Input validation and sanitization
- SQL injection prevention through parameterized queries

## 📊 Business Intelligence

The system provides comprehensive business analytics:

- **Profit/Loss Analysis**: Real-time profit margins and financial health
- **Milk Business Metrics**: Purchase vs sales analysis with quantity tracking
- **Payment Analytics**: Payment method preferences and transaction patterns
- **Trend Analysis**: Daily, monthly, and yearly business trends
- **Category Breakdown**: Income and expense categorization for insights

## 🚀 Deployment

### Production Deployment

1. Set up production environment variables
2. Configure production database
3. Run database migrations/triggers
4. Use PM2 or similar for process management:

```bash
npm install -g pm2
pm2 start server.js --name "milk-dairy-api"
```

### Environment Variables

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_jwt_secret
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=milk_dairy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@cbrainsolutions.com or create an issue in this repository.

## 🏆 Features Highlight

- **Zero Manual Financial Entry**: Complete automation through database triggers
- **Real-time Business Intelligence**: Live profit/loss and analytics
- **Enterprise-Grade Architecture**: Production-ready with comprehensive error handling
- **Complete Audit Trail**: Every transaction tracked and linked
- **Scalable Design**: Ready for multi-location dairy operations

---

**Built with ❤️ by CBrain Solutions**
