const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { db } = require("../config/database");

const dashboardController = {
  // Get comprehensive financial overview
  getFinancialOverview: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Default to current month if no dates provided
      const start =
        startDate ||
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0];
      const end = endDate || new Date().toISOString().split("T")[0];

      // Get income and expense totals
      const incomeTotal = await Income.getTotalByDateRange(start, end);
      const expenseTotal = await Expense.getTotalByDateRange(start, end);

      // Calculate profit/loss
      const totalIncome = parseFloat(incomeTotal.TotalIncome) || 0;
      const totalExpense = parseFloat(expenseTotal.TotalExpense) || 0;
      const netProfit = totalIncome - totalExpense;

      // Get category breakdowns
      const incomeCategories = await Income.getByCategory();
      const expenseCategories = await Expense.getCategorySummary();

      res.json({
        success: true,
        message: "Financial overview retrieved successfully",
        data: {
          dateRange: { startDate: start, endDate: end },
          summary: {
            totalIncome,
            totalExpense,
            netProfit,
            profitMargin:
              totalIncome > 0
                ? ((netProfit / totalIncome) * 100).toFixed(2)
                : 0,
          },
          incomeBreakdown: incomeCategories,
          expenseBreakdown: expenseCategories,
        },
      });
    } catch (error) {
      console.error("Error getting financial overview:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve financial overview",
        error: error.message,
      });
    }
  },

  // Get daily profit/loss report
  getDailyProfitLoss: async (req, res) => {
    try {
      const { date } = req.params;

      const incomeDaily = await Income.getDailySummary(date);
      const expenseDaily = await Expense.getDailySummary(date);

      const dailyIncome = parseFloat(incomeDaily.TotalIncome) || 0;
      const dailyExpense = parseFloat(expenseDaily.TotalExpense) || 0;
      const dailyProfit = dailyIncome - dailyExpense;

      res.json({
        success: true,
        message: "Daily profit/loss retrieved successfully",
        data: {
          date,
          dailyIncome,
          dailyExpense,
          dailyProfit,
          profitMargin:
            dailyIncome > 0
              ? ((dailyProfit / dailyIncome) * 100).toFixed(2)
              : 0,
        },
      });
    } catch (error) {
      console.error("Error getting daily profit/loss:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve daily profit/loss",
        error: error.message,
      });
    }
  },

  // Get monthly trends
  getMonthlyTrends: async (req, res) => {
    try {
      const { year, month } = req.params;

      const incomeMonthly = await Income.getMonthlySummary(year, month);
      const expenseMonthly = await Expense.getMonthlySummary(year, month);

      // Combine and calculate daily profits
      const trends = incomeMonthly.map((incomeDay) => {
        const expenseDay = expenseMonthly.find(
          (exp) => exp.Date === incomeDay.Date
        );
        const dailyIncome = parseFloat(incomeDay.DailyIncome) || 0;
        const dailyExpense = parseFloat(expenseDay?.DailyExpense) || 0;

        return {
          date: incomeDay.Date,
          income: dailyIncome,
          expense: dailyExpense,
          profit: dailyIncome - dailyExpense,
        };
      });

      // Add any expense-only days
      expenseMonthly.forEach((expenseDay) => {
        if (!trends.find((t) => t.date === expenseDay.Date)) {
          const dailyExpense = parseFloat(expenseDay.DailyExpense) || 0;
          trends.push({
            date: expenseDay.Date,
            income: 0,
            expense: dailyExpense,
            profit: -dailyExpense,
          });
        }
      });

      // Sort by date
      trends.sort((a, b) => new Date(a.date) - new Date(b.date));

      res.json({
        success: true,
        message: "Monthly trends retrieved successfully",
        data: {
          year,
          month,
          trends,
        },
      });
    } catch (error) {
      console.error("Error getting monthly trends:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve monthly trends",
        error: error.message,
      });
    }
  },

  // Get milk business analytics
  getMilkBusinessAnalytics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start =
        startDate ||
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0];
      const end = endDate || new Date().toISOString().split("T")[0];

      // Milk purchase analysis
      const [milkPurchases] = await db.execute(
        `SELECT 
           SUM(TotalAmount) as TotalPurchaseCost,
           SUM(TotalQty) as TotalPurchaseQty,
           AVG(BuyerPrice) as AvgPurchasePrice,
           COUNT(*) as TotalPurchases
         FROM MilkStore 
         WHERE Date BETWEEN ? AND ? AND IsDeleted = 0`,
        [start, end]
      );

      // Milk sales analysis
      const [milkSales] = await db.execute(
        `SELECT 
           SUM(TotalAmount) as TotalSalesRevenue,
           SUM(TotalQty) as TotalSalesQty,
           AVG(SellerPrice) as AvgSalesPrice,
           COUNT(*) as TotalSales
         FROM MilkDistribution 
         WHERE Date BETWEEN ? AND ? AND IsDeleted = 0`,
        [start, end]
      );

      const purchase = milkPurchases[0];
      const sales = milkSales[0];

      const totalPurchaseCost = parseFloat(purchase.TotalPurchaseCost) || 0;
      const totalSalesRevenue = parseFloat(sales.TotalSalesRevenue) || 0;
      const milkProfit = totalSalesRevenue - totalPurchaseCost;

      const totalPurchaseQty = parseFloat(purchase.TotalPurchaseQty) || 0;
      const totalSalesQty = parseFloat(sales.TotalSalesQty) || 0;

      res.json({
        success: true,
        message: "Milk business analytics retrieved successfully",
        data: {
          dateRange: { startDate: start, endDate: end },
          purchases: {
            totalCost: totalPurchaseCost,
            totalQuantity: totalPurchaseQty,
            averagePrice: parseFloat(purchase.AvgPurchasePrice) || 0,
            totalTransactions: purchase.TotalPurchases,
          },
          sales: {
            totalRevenue: totalSalesRevenue,
            totalQuantity: totalSalesQty,
            averagePrice: parseFloat(sales.AvgSalesPrice) || 0,
            totalTransactions: sales.TotalSales,
          },
          analysis: {
            milkProfit,
            profitMargin:
              totalSalesRevenue > 0
                ? ((milkProfit / totalSalesRevenue) * 100).toFixed(2)
                : 0,
            quantityBalance: totalPurchaseQty - totalSalesQty,
            priceSpread:
              (parseFloat(sales.AvgSalesPrice) || 0) -
              (parseFloat(purchase.AvgPurchasePrice) || 0),
          },
        },
      });
    } catch (error) {
      console.error("Error getting milk business analytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve milk business analytics",
        error: error.message,
      });
    }
  },

  // Get payment analytics
  getPaymentAnalytics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start =
        startDate ||
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0];
      const end = endDate || new Date().toISOString().split("T")[0];

      // Buyer payments (income)
      const [buyerPayments] = await db.execute(
        `SELECT 
           SUM(PaymentAmount) as TotalReceived,
           COUNT(*) as TotalPayments,
           PaymentType,
           PaymentMethod
         FROM BuyerPayments 
         WHERE Date BETWEEN ? AND ? AND IsDeleted = 0
         GROUP BY PaymentType, PaymentMethod`,
        [start, end]
      );

      // Seller payments (expense)
      const [sellerPayments] = await db.execute(
        `SELECT 
           SUM(PaymentAmount) as TotalPaid,
           COUNT(*) as TotalPayments,
           PaymentType,
           PaymentMethod
         FROM SellerPayments 
         WHERE Date BETWEEN ? AND ? AND IsDeleted = 0
         GROUP BY PaymentType, PaymentMethod`,
        [start, end]
      );

      res.json({
        success: true,
        message: "Payment analytics retrieved successfully",
        data: {
          dateRange: { startDate: start, endDate: end },
          buyerPayments,
          sellerPayments,
        },
      });
    } catch (error) {
      console.error("Error getting payment analytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve payment analytics",
        error: error.message,
      });
    }
  },
};

module.exports = dashboardController;
