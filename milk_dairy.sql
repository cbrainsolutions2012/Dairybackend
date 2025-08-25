create database milk_dairy;
use milk_dairy;
grant all privileges on milk_dairy to 'nodeuser'@'%';
flush privileges;
show databases;

drop table Users;
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Buyers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    MobileNumber VARCHAR(15) UNIQUE NOT NULL,
    City VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fixed typo
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Sellers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    MobileNumber VARCHAR(15) UNIQUE NOT NULL,
    City VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fixed typo
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Income (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Amount DECIMAL(10,2) NOT NULL,
    Description TEXT NOT NULL,
    Source VARCHAR(100) NOT NULL,
    Date DATE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fixed typo
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Expense (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Amount DECIMAL(10,2) NOT NULL,
    Description TEXT NOT NULL,
    PaidTo VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Date DATE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fixed typo
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE MilkStore (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    BuyerId INT NOT NULL,
    BuyerName VARCHAR(100) NOT NULL,
    MilkType ENUM('cow', 'buffalo') NOT NULL,
    BuyerPrice DECIMAL(10,2) NOT NULL,
    TotalQty DECIMAL(10,2) NOT NULL,
    Date DATE NOT NULL,
    FatPercentage DECIMAL(5,2) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (BuyerId) REFERENCES Buyers(Id)
);

CREATE TABLE MilkDistribution (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    SellerId INT NOT NULL,
    SellerName VARCHAR(100) NOT NULL,
    MilkType ENUM('cow', 'buffalo') NOT NULL,
    SellerPrice DECIMAL(10,2) NOT NULL,
    TotalQty DECIMAL(10,2) NOT NULL,
    Date DATE NOT NULL,
    FatPercentage DECIMAL(5,2) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (SellerId) REFERENCES Sellers(Id)
);

CREATE TABLE BuyerPayments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    BuyerId INT NOT NULL,
    PaymentAmount DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentType ENUM('cash', 'online', 'bank_transfer', 'dd', 'cheque') NOT NULL,
    TransactionId VARCHAR(100) NULL,
    BankName VARCHAR(100) NULL,
    ChequeNumber VARCHAR(50) NULL,
    DdNumber VARCHAR(50) NULL,
    ReferenceNumber VARCHAR(100) NULL,
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (BuyerId) REFERENCES Buyers(Id)
);

CREATE TABLE SellerPayments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    SellerId INT NOT NULL,
    PaymentAmount DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentType ENUM('cash', 'online', 'bank_transfer', 'dd', 'cheque') NOT NULL,
    TransactionId VARCHAR(100) NULL,
    BankName VARCHAR(100) NULL,
    ChequeNumber VARCHAR(50) NULL,
    DdNumber VARCHAR(50) NULL,
    ReferenceNumber VARCHAR(100) NULL,
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (SellerId) REFERENCES Sellers(Id)
);

SHOW TABLES;

-- Use your database
USE milk_dairy;

-- Set delimiter for trigger creation
DELIMITER //

-- 1. Trigger: When you buy milk from buyer (EXPENSE)
CREATE TRIGGER milk_purchase_expense 
AFTER INSERT ON MilkStore
FOR EACH ROW
BEGIN
    INSERT INTO Expense (
        Amount, Description, PaidTo, Category, Date, CreatedAt, IsDeleted
    ) VALUES (
        NEW.TotalAmount, 
        CONCAT('Milk purchase - ', NEW.TotalQty, 'L ', NEW.MilkType, ' milk @ ₹', NEW.BuyerPrice, '/L'),
        NEW.BuyerName,
        'milk_purchase',
        NEW.Date,
        NOW(),
        0
    );
END//

-- 2. Trigger: When you sell milk to seller (INCOME)
CREATE TRIGGER milk_sale_income 
AFTER INSERT ON MilkDistribution
FOR EACH ROW
BEGIN
    INSERT INTO Income (
        Amount, Description, Source, Date, CreatedAt, IsDeleted
    ) VALUES (
        NEW.TotalAmount, 
        CONCAT('Milk sale - ', NEW.TotalQty, 'L ', NEW.MilkType, ' milk @ ₹', NEW.SellerPrice, '/L'),
        NEW.SellerName,
        NEW.Date,
        NOW(),
        0
    );
END//

-- 3. Trigger: When buyer pays you money (INCOME)
CREATE TRIGGER buyer_payment_income 
AFTER INSERT ON BuyerPayments
FOR EACH ROW
BEGIN
    INSERT INTO Income (
        Amount, Description, Source, Date, CreatedAt, IsDeleted
    ) VALUES (
        NEW.PaymentAmount, 
        CONCAT('Payment received (', NEW.PaymentType, ') - ', COALESCE(NEW.Notes, 'Payment from buyer')),
        (SELECT FullName FROM Buyers WHERE Id = NEW.BuyerId),
        NEW.PaymentDate,
        NOW(),
        0
    );
END//

-- 4. Trigger: When you pay seller (EXPENSE)
CREATE TRIGGER seller_payment_expense 
AFTER INSERT ON SellerPayments
FOR EACH ROW
BEGIN
    INSERT INTO Expense (
        Amount, Description, PaidTo, Category, Date, CreatedAt, IsDeleted
    ) VALUES (
        NEW.PaymentAmount, 
        CONCAT('Payment made (', NEW.PaymentType, ') - ', COALESCE(NEW.Notes, 'Payment to seller')),
        (SELECT FullName FROM Sellers WHERE Id = NEW.SellerId),
        'seller_payment',
        NEW.PaymentDate,
        NOW(),
        0
    );
END//

-- Reset delimiter
DELIMITER ;

-- Show triggers created
SHOW TRIGGERS;

-- 1. Insert a test buyer
INSERT INTO Buyers (FullName, MobileNumber, City) 
VALUES ('Ramesh Kumar', '9876543210', 'Mumbai');

-- 2. Insert a test seller
INSERT INTO Sellers (FullName, MobileNumber, City) 
VALUES ('Suresh Patel', '9876543211', 'Pune');

-- 3. Test milk purchase from buyer (should auto-create expense)
INSERT INTO MilkStore (BuyerId, BuyerName, MilkType, BuyerPrice, TotalQty, Date, FatPercentage, TotalAmount) 
VALUES (1, 'Ramesh Kumar', 'cow', 45.50, 10.0, '2024-08-22', 3.5, 455.00);

-- 4. Test milk sale to seller (should auto-create income)
INSERT INTO MilkDistribution (SellerId, SellerName, MilkType, SellerPrice, TotalQty, Date, FatPercentage, TotalAmount) 
VALUES (1, 'Suresh Patel', 'cow', 50.00, 8.0, '2024-08-22', 3.5, 400.00);

-- 5. Check if automatic entries were created
SELECT * FROM Income;
SELECT * FROM Expense;

-- 6. Check all data
SELECT * FROM Buyers;
SELECT * FROM Sellers;
SELECT * FROM MilkStore;
SELECT * FROM MilkDistribution;

-- Set delimiter for trigger creation
DELIMITER //

-- 1. UPDATE trigger for MilkStore (Update expense when milk purchase is updated)
CREATE TRIGGER milk_purchase_expense_update 
AFTER UPDATE ON MilkStore
FOR EACH ROW
BEGIN
    -- Update the corresponding expense record
    UPDATE Expense 
    SET 
        Amount = NEW.TotalAmount,
        Description = CONCAT('Milk purchase - ', NEW.TotalQty, 'L ', NEW.MilkType, ' milk @ ₹', NEW.BuyerPrice, '/L'),
        PaidTo = NEW.BuyerName,
        Date = NEW.Date
    WHERE 
        Description = CONCAT('Milk purchase - ', OLD.TotalQty, 'L ', OLD.MilkType, ' milk @ ₹', OLD.BuyerPrice, '/L')
        AND PaidTo = OLD.BuyerName
        AND Date = OLD.Date
        AND Category = 'milk_purchase'
        AND IsDeleted = 0;
END//

-- 2. DELETE trigger for MilkStore (Soft delete expense when milk purchase is deleted)
CREATE TRIGGER milk_purchase_expense_delete 
AFTER UPDATE ON MilkStore
FOR EACH ROW
BEGIN
    -- When IsDeleted changes from 0 to 1 (soft delete)
    IF OLD.IsDeleted = 0 AND NEW.IsDeleted = 1 THEN
        UPDATE Expense 
        SET IsDeleted = 1
        WHERE 
            Description = CONCAT('Milk purchase - ', OLD.TotalQty, 'L ', OLD.MilkType, ' milk @ ₹', OLD.BuyerPrice, '/L')
            AND PaidTo = OLD.BuyerName
            AND Date = OLD.Date
            AND Category = 'milk_purchase'
            AND IsDeleted = 0;
    END IF;
END//

-- 3. UPDATE trigger for MilkDistribution (Update income when milk sale is updated)
CREATE TRIGGER milk_sale_income_update 
AFTER UPDATE ON MilkDistribution
FOR EACH ROW
BEGIN
    -- Update the corresponding income record
    UPDATE Income 
    SET 
        Amount = NEW.TotalAmount,
        Description = CONCAT('Milk sale - ', NEW.TotalQty, 'L ', NEW.MilkType, ' milk @ ₹', NEW.SellerPrice, '/L'),
        Source = NEW.SellerName,
        Date = NEW.Date
    WHERE 
        Description = CONCAT('Milk sale - ', OLD.TotalQty, 'L ', OLD.MilkType, ' milk @ ₹', OLD.SellerPrice, '/L')
        AND Source = OLD.SellerName
        AND Date = OLD.Date
        AND IsDeleted = 0;
END//

-- 4. DELETE trigger for MilkDistribution (Soft delete income when milk sale is deleted)
CREATE TRIGGER milk_sale_income_delete 
AFTER UPDATE ON MilkDistribution
FOR EACH ROW
BEGIN
    -- When IsDeleted changes from 0 to 1 (soft delete)
    IF OLD.IsDeleted = 0 AND NEW.IsDeleted = 1 THEN
        UPDATE Income 
        SET IsDeleted = 1
        WHERE 
            Description = CONCAT('Milk sale - ', OLD.TotalQty, 'L ', OLD.MilkType, ' milk @ ₹', OLD.SellerPrice, '/L')
            AND Source = OLD.SellerName
            AND Date = OLD.Date
            AND IsDeleted = 0;
    END IF;
END//

-- Reset delimiter
DELIMITER ;

-- Show all triggers
SHOW TRIGGERS;