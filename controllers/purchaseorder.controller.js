// this file have the logic to manage purchase orders
const connectionPool = require('../configs/db.config');
/**
 * Create a function to allow the user to create a purchase order at a time
 *
 * when a user calls the endpoint:
 * POST stockapplication/api/v1/purchaseorders , router should call the below method
 */
exports.createPurchaseorder = async (req, res) => {
    // logic to handle the purchase orders creation
    const connection = await connectionPool.getConnection();

    try {
        const [purchasedBook, bookExtra] = await connection.query(`SELECT * FROM books WHERE id = ${req.body.bookId}`);
        if (purchasedBook.length == 0) {
            return res.status(401).send({
                message: "Book id given is not correct, Please add the book first to create purchase order for it.",
                status: 401
            });
        }

        const [selectedWarehouse, warehouseExtra] = await connection.query(`SELECT * FROM warehouses WHERE id = ${req.body.warehouseId}`);
        if (selectedWarehouse.length == 0) {
            return res.status(401).send({
                message: "Warehouses id given is not correct, Please add the warehouse first to create purchase order for it.",
                status: 401
            });
        }

        await connection.beginTransaction();

        const [insertedPurchaseorder, insertedExtra] = await connection.query(`INSERT INTO purchaseorders (bookId, warehouseId, quantity) VALUES(${req.body.bookId}, ${req.body.warehouseId}, ${req.body.quantity})`);

        await connection.query(`INSERT INTO stockdetails (bookId, warehouseId, quantity) VALUES(${req.body.bookId}, ${req.body.warehouseId}, ${req.body.quantity}) ON DUPLICATE KEY UPDATE quantity = quantity + ${req.body.quantity}`);

        const [createdPurchaseorder, createdExtra] = await connection.query(`SELECT purchaseorders.id, purchaseorders.quantity AS purchasedQuantity, purchaseorders.created_at, books.name AS bookName, warehouses.name AS warehouseName, warehouses.location AS warehouseLocation, stockdetails.quantity AS availableQuantity
        FROM purchaseorders
        INNER JOIN warehouses ON purchaseorders.warehouseId = warehouses.id
        INNER JOIN books ON purchaseorders.bookId = books.id
        INNER JOIN stockdetails ON purchaseorders.warehouseId = stockdetails.warehouseId AND purchaseorders.bookId = stockdetails.bookId
        WHERE purchaseorders.id = ${insertedPurchaseorder.insertId};`);

        // Commit the transaction
        await connection.commit();

        res.status(201).send({
            data: createdPurchaseorder[0],
            message: "Successfully added a purchase order.",
            status: 201
        });
    } catch (err) {
        // Rollback the transaction if an error occurred
        await connection.rollback();
        console.log("Error while adding purchase order ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
};