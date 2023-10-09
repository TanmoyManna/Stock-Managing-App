// this file have the logic to manage sell orders
const connectionPool = require('../configs/db.config');
/**
 * Create a function to allow the user to create a sell order at a time
 *
 * when a user calls the endpoint:
 * POST stockapplication/api/v1/sellorders , router should call the below method
 */
exports.createSellorder = async (req, res) => {
    // logic to handle the sell order creation

    const connection = await connectionPool.getConnection();
    try {
        const [orderedBook, bookExtra] = await connection.query(`SELECT id FROM books WHERE id = ${req.body.bookId}`);
        if (orderedBook.length == 0) {
            return res.status(401).send({
                message: "Book id given is not correct",
                status: 401
            });
        }

        const [availableWarehouses, warehouseExtra] = await connection.query(`SELECT warehouseId FROM stockdetails WHERE bookId = ${req.body.bookId} AND quantity >= ${req.body.quantity} ORDER BY quantity DESC`);
        console.log(availableWarehouses);
        if (availableWarehouses.length == 0) {
            return res.status(403).send({
                message: "Book is currently out of stock, Please try again later",
                status: 403
            });
        }

        await connection.beginTransaction();

        const [insertedSellorder, insertedExtra] = await connection.query(`INSERT INTO sellorders (bookId, warehouseId, customerId, quantity) VALUES(${req.body.bookId}, ${availableWarehouses[0].warehouseId}, ${req.userId}, ${req.body.quantity})`);
        
        await connection.query(`UPDATE stockdetails SET quantity = quantity - ${req.body.quantity}   WHERE bookId = ${req.body.bookId} AND warehouseId = ${availableWarehouses[0].warehouseId}`);

        const [createdSellorder, createdExtra] = await connection.query(`SELECT sellorders.id, sellorders.quantity AS selledQuantity, sellorders.created_at, books.name AS bookName, warehouses.name AS warehouseName, warehouses.location AS warehouseLocation, stockdetails.quantity AS availableQuantity
        FROM sellorders
        INNER JOIN warehouses ON sellorders.warehouseId = warehouses.id
        INNER JOIN books ON sellorders.bookId = books.id
        INNER JOIN stockdetails ON sellorders.warehouseId = stockdetails.warehouseId AND sellorders.bookId = stockdetails.bookId
        WHERE sellorders.id = ${insertedSellorder.insertId};`);

        // Commit the transaction
        await connection.commit();

        res.status(201).send({
            data: createdSellorder[0],
            message: "Successfully added a sell order.",
            status: 201
        });
    } catch (err) {
        // Rollback the transaction if an error occurred
        await connection.rollback();
        console.log("Error while adding sell order ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
};