/**
* This will have the logic to route the request to sell order controller
*/
const auth = require("../middlewares/authjwt");
const sellorderMiddleware = require("../middlewares/sellorder.middleware");
const sellorderController = require("../controllers/sellorder.controller");
module.exports = (app) => {

    /**
     * Define the route for creating a sell order
     * 
     * POST /stockapplication/api/v1/auth/sellorders -> sellorder Controller createSellorder method
     */
    app.post("/stockapplication/api/v1/sellorders",[auth.verifytoken, auth.isCustomer, sellorderMiddleware.validateSellorderBody], sellorderController.createSellorder);

}