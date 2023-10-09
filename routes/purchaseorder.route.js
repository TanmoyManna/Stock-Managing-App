/**
* This will have the logic to route the request to purchase order controller
*/
const auth = require("../middlewares/authjwt");
const purchaseorderMiddleware = require("../middlewares/purchaseorder.middleware");
const purchaseorderController = require("../controllers/purchaseorder.controller");
module.exports = (app) => {

    /**
     * Define the route for creating a sell order
     * 
     * POST /stockapplication/api/v1/auth/purchaseorders -> purchaseorder Controller createPurchaseorder method
     */
    app.post("/stockapplication/api/v1/purchaseorders", [auth.verifytoken, auth.isAdmin, purchaseorderMiddleware.validatePurchaseorderBody], purchaseorderController.createPurchaseorder);

}