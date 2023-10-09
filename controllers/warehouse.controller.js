// this file have the logic to manage warehouses
const connectionPool = require('../configs/db.config');
/**
 * Create a function to allow the user to create a warehouse at a time
 *
 * when a user calls the endpoint:
 * POST stockapplication/api/v1/warehouses , router should call the below method
 */
exports.createWarehouse = async (req, res) => {
    // logic to handle the warehouse creation
    try {
        const warehouseObj = {
            name: req.body.name,
            location: req.body.location,
        };
        const [warehouseSaved, _extra] = await connectionPool.query(`SELECT * FROM warehouses WHERE name = '${warehouseObj.name}'`);
        if (warehouseSaved.length > 0) {
            return res.status(409).send({
                message: "Name given is already taken, Please use another name.",
                status: 409
            });
        }

        const [insertedWarehouse, insertedExtra] = await connectionPool.query(`INSERT INTO warehouses (name, location) VALUES ('${warehouseObj.name}', '${warehouseObj.location}')`);
        const [result, extra] = await connectionPool.query(`SELECT * FROM warehouses WHERE id = '${insertedWarehouse.insertId}'`);
        const postResponse = {
            id: result[0].id,
            name: result[0].name,
            location: result[0].location,
            created_at: result[0].created_at,
            updated_at: result[0].updated_at,
        };
        res.status(201).send({
            data: postResponse,
            message: "Successfully added a Warehouse",
            status: 201
        });
    } catch (err) {
        console.log("Error while adding warehouse ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Create a function to allow the user to get warehouses details at a time
 *
 * when a user calls the endpoint:
 * GET stockapplication/api/v1/warehouses , router should call the below method
 */
exports.getAllWarehouse = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM warehouses`);

        // send the res back
        res.status(200).send({
            status: 200,
            data: result,
            message: "Successfully fetched warehouses data",
        });
    } catch (err) {
        console.log("Error while fetching warehouses data ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Create a function to allow the user to get a single warehouse details at a time
 *
 * when a user calls the endpoint:
 * GET stockapplication/api/v1/warehouses/:warehouseId , router should call the below method
 */
exports.getAWarehouse = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM warehouses WHERE id = ${req.params.warehouseId}`);

        if (result.length == 0) {
            return res.status(401).send({
                message: "Warehouse id given is not correct",
                status: 401
            });
        }

        // send the res back
        res.status(200).send({
            status: 200,
            data: result[0],
            message: "Successfully fetched warehouse data",
        });
    } catch (err) {
        console.log("Error while fetching warehouse data ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Create a function to allow the user to delete a single warehouse details at a time
 *
 * when a user calls the endpoint:
 * DELETE stockapplication/api/v1/warehouses/:warehouseId , router should call the below method
 */
exports.deleteWarehouse = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM warehouses WHERE id = ${req.params.warehouseId}`);

        if (result.length == 0) {
            return res.status(401).send({
                message: "Warehouse id given is not correct",
                status: 401
            });
        }

        await connectionPool.query(`DELETE FROM warehouses WHERE id = ${req.params.warehouseId}`);

        // send the res back
        res.status(200).send({
            status: 200,
            message: "Successfully deleted warehouse data",
        });
    } catch (err) {
        console.log("Error while deleting warehouse data ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Function to allow the users to update a single warehouse details at a time
 * 
 * when a user calls the endpoint:
 * PUT stockapplication/api/v1/warehouses/:warehouseId , router should call the below method
 */
exports.updateWarehouse = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM warehouses WHERE id = ${req.params.warehouseId}`);

        if (result.length == 0) {
            return res.status(401).send({
                message: "Warehouse id given is not correct",
                status: 401
            });
        }

        await connectionPool.query(`UPDATE warehouses SET ? WHERE id = ?;`, [{ ...req.body }, req.params.warehouseId]);

        const [updatedResult, updatedExtra] = await connectionPool.query(`SELECT * FROM warehouses WHERE id = ${req.params.warehouseId}`);

        res.status(200).send({ data: updatedResult[0], message: "Successfully updated the warehouse", status: 200 });
    } catch (err) {
        console.log("Error while updating a warehouse ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
}

/**
 * Function to allow the users to transfer books from one warehouse to another
 * 
 * when a user calls the endpoint:
 * PATCH stockapplication/api/v1/warehouses/books/:bookId , router should call the below method
 */
exports.transfer = async (req, res) => {
    try {

        var [result, extra] = await connectionPool.query(`SELECT * FROM warehouses WHERE id = ${req.body.toWarehouseId}`);
        if (result.length == 0) {
            return res.status(401).send({
                message: "Warehouse to where books will be transferred is not correct, Please check.",
                status: 401
            });
        }


        var [result, extra] = await connectionPool.query(`SELECT * FROM stockdetails WHERE bookId = ${req.params.bookId} AND warehouseId = ${req.body.fromWarehouseId}`);
        if (result.length == 0) {
            return res.status(401).send({
                message: "Sorry, Currently have no stock of this book in this warehouse. Please check.",
                status: 401
            });
        }

        if (result[0].quantity < req.body.quantity) {
            return res.status(401).send({
                message: "Sorry, Currently we are running low on stock, Please reduce your desired transfer quantity.",
                status: 401
            });
        }

        const connection = await connectionPool.getConnection();
        try {

            await connection.beginTransaction();
            
            await connection.query(`INSERT INTO stockdetails (bookId, warehouseId, quantity) VALUES(${req.params.bookId}, ${req.body.toWarehouseId}, ${req.body.quantity}) ON DUPLICATE KEY UPDATE quantity = quantity + ${req.body.quantity}`);
            await connection.query(`UPDATE stockdetails SET quantity = quantity - ${req.body.quantity} WHERE bookId = ${req.params.bookId} AND warehouseId = ${req.body.fromWarehouseId}`);

            await connection.commit();
        } catch (err) {
            // Rollback the transaction if an error occurred
            await connection.rollback();
            console.log("Error while transferring with Transaction", err.message);
            res.status(500).send({
                message: "Some internal server error",
                status: 500
            });
        } finally {
            // Release the connection back to the pool
            connection.release();
        }

        res.status(200).send({message: "Successfully made the transfer", status: 200 });
    } catch (err) {
        console.log("Error while transferring ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
}