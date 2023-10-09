module.exports = async () => {
    try {
        const mysql = require('mysql2/promise');
        // create the connection to database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password'
        });

        await (await connection).query('CREATE DATABASE IF NOT EXISTS stockApplication');
        console.log("stockApplication DB created");

        await (await connection).query('USE stockApplication');
        console.log("now using stockApplication DB");

        await (await connection).query("CREATE TABLE IF NOT EXISTS users (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "email VARCHAR(255) NOT NULL UNIQUE," +
            "password VARCHAR(255) NOT NULL," +
            "role ENUM('admin', 'customer') NOT NULL," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );");
        console.log("users TABLE created");

        await (await connection).query("CREATE TABLE IF NOT EXISTS books (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL UNIQUE," +
            "authorName VARCHAR(255) NOT NULL," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );");
        console.log("books TABLE created");

        await (await connection).query("CREATE TABLE IF NOT EXISTS warehouses (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL UNIQUE," +
            "location VARCHAR(255) NOT NULL," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );");
        console.log("warehouses TABLE created");

        await (await connection).query("CREATE TABLE IF NOT EXISTS stockdetails (" +
            "bookId INT NOT NULL," +
            "warehouseId INT NOT NULL," +
            "quantity INT NOT NULL," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
            "PRIMARY KEY(bookId, warehouseId)," +
            "CONSTRAINT `stockDetails_fk_bookId` FOREIGN KEY (bookId) REFERENCES books(id)," +
            "CONSTRAINT `stockDetails_fk_warehouseId` FOREIGN KEY (warehouseId) REFERENCES warehouses(id));");
        console.log("stockdetails TABLE created");

        await (await connection).query("CREATE TABLE IF NOT EXISTS sellorders (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "bookId INT NOT NULL," +
            "warehouseId INT NOT NULL," +
            "customerId INT NOT NULL," +
            "quantity INT NOT NULL," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
            "CONSTRAINT `sellOrders_fk_bookId` FOREIGN KEY (bookId) REFERENCES books(id)," +
            "CONSTRAINT `sellOrders_fk_warehouseId` FOREIGN KEY (warehouseId) REFERENCES warehouses(id)," +
            "CONSTRAINT `sellOrders_fk_customerId` FOREIGN KEY (customerId) REFERENCES users(id));");
        console.log("sellorders TABLE created");

        await (await connection).query("CREATE TABLE IF NOT EXISTS purchaseorders (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "bookId INT NOT NULL," +
            "warehouseId INT NOT NULL," +
            "quantity INT NOT NULL," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
            "CONSTRAINT `purchaseOrders_fk_bookId` FOREIGN KEY (bookId) REFERENCES books(id)," +
            "CONSTRAINT `purchaseOrders_fk_warehouseId` FOREIGN KEY (warehouseId) REFERENCES warehouses(id));");
        console.log("purchaseorders TABLE created");

        connection.end();
    } catch (err) {
        console.log(err);
    }
};