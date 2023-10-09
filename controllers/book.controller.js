// this file have the logic to manage books
const connectionPool = require('../configs/db.config');
/**
 * Create a function to allow the user to create a book at a time
 *
 * when a user calls the endpoint:
 * POST stockapplication/api/v1/books , router should call the below method
 */
exports.createBook = async (req, res) => {
    // logic to handle the book creation
    try {
        const bookObj = {
            name: req.body.name,
            authorName: req.body.authorName,
        };
        const [bookSaved, _extra] = await connectionPool.query(`SELECT * FROM books WHERE name = '${bookObj.name}'`);
        if (bookSaved.length > 0) {
            return res.status(409).send({
                message: "Name given is already taken, Please use another name.",
                status: 409
            });
        }

        const [insertedBook, insertedExtra] = await connectionPool.query(`INSERT INTO books (name, authorName) VALUES ('${bookObj.name}', '${bookObj.authorName}')`);
        const [result, extra] = await connectionPool.query(`SELECT * FROM books WHERE id = '${insertedBook.insertId}'`);
        const postResponse = {
            id: result[0].id,
            name: result[0].name,
            authorName: result[0].authorName,
            created_at: result[0].created_at,
            updated_at: result[0].updated_at,
        };
        res.status(201).send({
            data: postResponse,
            message: "Successfully added a Book",
            status: 201
        });
    } catch (err) {
        console.log("Error while adding book ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Create a function to allow the user to get books details at a time
 *
 * when a user calls the endpoint:
 * GET stockapplication/api/v1/books , router should call the below method
 */
exports.getAllBook = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM books`);

        // send the res back
        res.status(200).send({
            status: 200,
            data: result,
            message: "Successfully fetched books data",
        });
    } catch (err) {
        console.log("Error while fetching books data ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Create a function to allow the user to get a single book details at a time
 *
 * when a user calls the endpoint:
 * GET stockapplication/api/v1/books/:bookId , router should call the below method
 */
exports.getABook = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM books WHERE id = ${req.params.bookId}`);

        if (result.length == 0) {
            return res.status(401).send({
                message: "Book id given is not correct",
                status: 401
            });
        }

        // send the res back
        res.status(200).send({
            status: 200,
            data: result[0],
            message: "Successfully fetched book data",
        });
    } catch (err) {
        console.log("Error while fetching book data ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Create a function to allow the user to delete a single book details at a time
 *
 * when a user calls the endpoint:
 * DELETE stockapplication/api/v1/books/:bookId , router should call the below method
 */
exports.deleteBook = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM books WHERE id = ${req.params.bookId}`);

        if (result.length == 0) {
            return res.status(401).send({
                message: "Book id given is not correct",
                status: 401
            });
        }

        await connectionPool.query(`DELETE FROM books WHERE id = ${req.params.bookId}`);

        // send the res back
        res.status(200).send({
            status: 200,
            message: "Successfully deleted book data",
        });
    } catch (err) {
        console.log("Error while deleting book data ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};

/**
 * Function to allow the users to update a single book details at a time
 * 
 * when a user calls the endpoint:
 * PUT stockapplication/api/v1/books/:bookId , router should call the below method
 */
exports.updateBook = async (req, res) => {
    try {
        const [result, extra] = await connectionPool.query(`SELECT * FROM books WHERE id = ${req.params.bookId}`);

        if (result.length == 0) {
            return res.status(401).send({
                message: "Book id given is not correct",
                status: 401
            });
        }

        await connectionPool.query(`UPDATE books SET ? WHERE id = ?;`, [{ ...req.body }, req.params.bookId]);

        const [updatedResult, updatedExtra] = await connectionPool.query(`SELECT * FROM books WHERE id = ${req.params.bookId}`);

        res.status(200).send({ data: updatedResult[0], message: "Successfully updated the book", status: 200 });
    } catch (err) {
        console.log("Error while updating a book ", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
}