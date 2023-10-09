/**
* This will have the logic to route the request to book controller
*/
const auth = require("../middlewares/authjwt");
const bookController = require("../controllers/book.controller");
const bookMiddleWare = require("../middlewares/book.middleware");

module.exports = (app) => {
    /**
    * Define the route to create a Book
    * 
    * POST stockapplication/api/v1/books -> bookController createBook method
    */
    app.post("/stockapplication/api/v1/books", [auth.verifytoken, auth.isAdmin, bookMiddleWare.validateBooksBody], bookController.createBook);

    /**
    * Define the route to get list of Book
    * 
    * GET stockapplication/api/v1/books -> bookController getAllBook method
    */
    app.get("/stockapplication/api/v1/books", [auth.verifytoken, auth.isAdmin], bookController.getAllBook);

    /**
    * Define the route to get details of a single Book
    * 
    * GET stockapplication/api/v1/books/:bookId -> bookController getABook method
    */
    app.get("/stockapplication/api/v1/books/:bookId", [auth.verifytoken, auth.isAdmin], bookController.getABook);

    /**
    * Define the route to delete a Book
    * 
    * DELETE stockapplication/api/v1/books/:bookId -> bookController deleteBook method
    */
    app.delete("/stockapplication/api/v1/books/:bookId", [auth.verifytoken, auth.isAdmin], bookController.deleteBook);

    /**
    * Define the route to update a Book
    * 
    * PUT stockapplication/api/v1/books/:bookId -> bookController updateBook method
    */
    app.put("/stockapplication/api/v1/books/:bookId", [auth.verifytoken, auth.isAdmin], bookController.updateBook);
}