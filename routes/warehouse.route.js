/**
* This will have the logic to route the request to warehouse controller
*/
const auth = require("../middlewares/authjwt");
const warehouseController = require("../controllers/warehouse.controller");
const warehouseMiddleware = require("../middlewares/warehouse.middleware");


module.exports = (app) => {
    /**
    * Define the route to create a Warehouse
    * 
    * POST stockapplication/api/v1/warehouses -> warehouseController createWarehouse method
    */
    app.post("/stockapplication/api/v1/warehouses", [auth.verifytoken, auth.isAdmin, warehouseMiddleware.validateWarehousesBody], warehouseController.createWarehouse);

    /**
    * Define the route to get list of Warehouse
    * 
    * GET stockapplication/api/v1/warehouses -> warehouseController getAllWarehouse method
    */
    app.get("/stockapplication/api/v1/warehouses", [auth.verifytoken, auth.isAdmin], warehouseController.getAllWarehouse);

    /**
    * Define the route to get details of a single Warehouse
    * 
    * GET stockapplication/api/v1/warehouses/:warehouseId -> warehouseController getAWarehouse method
    */
    app.get("/stockapplication/api/v1/warehouses/:warehouseId", [auth.verifytoken, auth.isAdmin], warehouseController.getAWarehouse);

    /**
    * Define the route to delete a Warehouse
    * 
    * DELETE stockapplication/api/v1/warehouses/:warehouseId -> warehouseController deleteWarehouse method
    */
    app.delete("/stockapplication/api/v1/warehouses/:warehouseId", [auth.verifytoken, auth.isAdmin], warehouseController.deleteWarehouse);

    /**
    * Define the route to update a Warehouse
    * 
    * PUT stockapplication/api/v1/warehouses/:warehouseId -> warehouseController updateWarehouse method
    */
    app.put("/stockapplication/api/v1/warehouses/:warehouseId", [auth.verifytoken, auth.isAdmin], warehouseController.updateWarehouse);

    /**
    * Define the route to transfer books from one warehouse to another
    * 
    * PATCH stockapplication/api/v1/warehouses/books/:bookId -> warehouseController updateWarehouse method
    */
    app.patch("/stockapplication/api/v1/warehouses/books/:bookId", [auth.verifytoken, auth.isAdmin, warehouseMiddleware.validateTransferBody], warehouseController.transfer);
}