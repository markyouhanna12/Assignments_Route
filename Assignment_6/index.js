const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"127.0.0.1",
    port:3306,
    user:"root",
    password:"root",
    database:"retail_store"

})

// 1- Create the required tables for the retail store database based on the tables structure and relationships.
connection.query(`
    CREATE TABLE IF NOT EXISTS Suppliers 
                (SupplierID INT AUTO_INCREMENT PRIMARY KEY,
                SupplierName VARCHAR(255),
                ContactNumber VARCHAR(50))`, (err,results) => {
    if (err) {
        console.error("Error creating Suppliers table:", err);
    }else {        
        console.log("Suppliers table created or already exists.");
    }
});

connection.query(`
            CREATE TABLE IF NOT EXISTS Products (
                ProductID INT AUTO_INCREMENT PRIMARY KEY,
                ProductName VARCHAR(255),
                Price DECIMAL(10,2),
                StockQuantity INT,
                SupplierID INT,
                FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID))`, (err,results) => {
    if (err) {
        console.error("Error creating Products table:", err);
    }else {        
        console.log("Products table created or already exists.");
    }
});

connection.query(`
            CREATE TABLE IF NOT EXISTS Sales (
                SaleID INT AUTO_INCREMENT PRIMARY KEY,
                ProductID INT,
                QuantitySold INT,
                SaleDate DATE,
                FOREIGN KEY (ProductID) REFERENCES Products(ProductID))`, (err,results) => {
    if (err) {
        console.error("Error creating Sales table:", err);
    }else {        
        console.log("Sales table created or already exists.");
    }
});



// 2- Add a column “Category” to the Products table.
connection.query(`AlTER TABLE Products ADD COLUMN Category VARCHAR(255)`,
    (err,results)=>{
        if(err){
            console.error("Error adding Category column to Products table:", err);
        }
        else{
            console.log("Category column added to Products table.");
        }
    })

// 3- Remove the “Category” column from Products.

connection.query(`ALTER TABLE Products DROP COLUMN Category`,
    (err,results)=>{
        if(err){
            console.error("Error removing Category column to Products table:", err);
        }
        else{
            console.log("Category column removed from Products table.");
        }
    })

// 4- Change “ContactNumber” column in Suppliers to VARCHAR (15).

connection.query(`ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)`,
    (err,results)=>{
        if(err){
            console.error("Error modifying “ContactNumber” column in Suppliers table:", err);
        }
        else{
            console.log("ContactNumber column has been modified");
        }
    })

// 5- Add a NOT NULL constraint to ProductName.
connection.query(`ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)`,
    (err,results)=>{
        if(err){
            console.error("Error:", err);
        }
        else{
            console.log("ProductName constraint has been added");
        }
    })


// 6- Perform Basic Inserts
// a) Add Supplier
connection.query(`INSERT INTO Suppliers (SupplierName, ContactNumber)
VALUES ('FreshFoods', '01001234567')`,(err,results)=>{
    if(err){
        console.log("Error:",err);
        
    }else{
        console.log('Supplier data has been added');        
    }

})

// b) Insert Products
connection.query(`INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
VALUES ('Milk', 15.00, 50, 1),('Bread', 10.00, 30, 1),('Eggs', 20.00, 40, 1)`,
    (err,results)=>{
    if(err){
        console.log("Error:",err);
        
    }else{
        console.log('Products data has been added');        
    }
    
})

// c) Add Sale
connection.query(`INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
VALUES ((SELECT ProductID FROM Products WHERE ProductName = 'Milk'),2,'2025-05-20')`,
    (err,results)=>{
    if(err){
        console.log("Error:",err);
        
    }else{
        console.log('Sale data has been added');        
    }
    
})

// 7- Update the price of 'Bread' to 25.00.
connection.query(`UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'`,
    (err,results)=>{
    if(err){
        console.log("Error:",err);
        
    }else{
        console.log('Price of Bread has been updated');        
    }
})

// 8- Delete the product 'Eggs'.
connection.query(`DELETE FROM Products WHERE ProductName = 'Eggs'`,
    (err,results)=>{
    if(err){
        console.log("Error:",err);
        
    }else{
        console.log('Eggs product has been deleted');        
    }
})

// 9- Retrieve the total quantity sold for each product.
total_quantity_query = `SELECT p.ProductName, SUM(s.QuantitySold) AS TotalQuantitySold
FROM Products p
LEFT JOIN Sales s ON p.ProductID = s.ProductID
GROUP BY p.ProductName`
connection.query(total_quantity_query,
(err,results)=>{
    if(err){
        console.log("Error:",err);
        
    }else{
        console.log(`Total quantity sold for each products is:${JSON.stringify(results)}`);        
    }
})


// 10-Get the product with the highest stock.
connection.query(`SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1`,
    (err,results)=>{
        if(err){
        console.log("Error:",err);
        
    }else{
        console.log(`Product with the highest stock is:${JSON.stringify(results)}`);        
    }
})

// 11-Find suppliers with names starting with 'F'.
connection.query(`SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'`,
    (err,results)=>{
        if(err){
        console.log("Error:",err);
        }else{
        console.log(`Suppliers with names starting with 'F':${JSON.stringify(results)}`);
        }
})

// 12-Show all products that have never been sold.
connection.query(`SELECT p.ProductName
FROM Products p LEFT JOIN Sales s ON p.ProductID = s.ProductID WHERE s.ProductID IS NULL`,
(err,results)=>{
    if(err){
        console.log("Error:",err)
    }else{
        console.log(`Products that have never been sold:${JSON.stringify(results)}`);
    }
})

// 13-Get all sales along with product name and sale date.

connection.query(`SELECT p.ProductName, s.SaleDate, s.QuantitySold FROM Sales s JOIN Products p ON s.ProductID = p.ProductID`,
    (err,results)=>{
        if(err){
            console.log("Error:",err)
        }else{
            console.log(`All sales along with product name and sale date:${JSON.stringify(results)}`);
        }
    }
)

// 14-Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables.

connection.query(`CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'password123'`,
    (err,results)=>{
        if(err){
            console.log("Error creating user:",err)
        }else{
            console.log("User 'store_manager' created successfully.");
    }
})
connection.query(`GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'localhost'`,
    (err,results)=>{
        if(err){
            console.log("Error granting permissions:",err)
        }else{
            console.log("Permissions granted to 'store_manager' successfully.");
    }
})

// 15-Revoke UPDATE permission from “store_manager”.

connection.query(`REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost'`,
    (err,results)=>{
        if(err){
            console.log("Error revoking permissions:",err)
        }
        else{
            console.log("UPDATE permission revoked from 'store_manager' successfully.");
        }
    }
)

// 16-Grant DELETE permission to “store_manager” only on the Sales table.

connection.query(`GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost';`,
    (err,results)=>{
        if(err){
            console.log("Error granting DELETE permission:",err)
        }
        else{
            console.log("DELETE permission granted to 'store_manager' on Sales table successfully.");
    }
})