/**
* This will have the logic to route the request to report controller
*/
const auth = require("../middlewares/authjwt");
const reportController = require("../controllers/report.controller");
module.exports = (app) => {

    /**
     * Define the route for getting a purchase order report
     * 
     * POST /stockapplication/api/v1/reports/purchaseorders -> report Controller getPurchaseorderReports method
     */
    app.get("/stockapplication/api/v1/reports/purchaseorders", [auth.verifytoken, auth.isAdmin], reportController.getPurchaseorderReports);

    /**
    * Define the route for getting a sell order report
    * 
    * POST /stockapplication/api/v1/reports/sellorders -> report Controller getSellorderReports method
    */
    app.get("/stockapplication/api/v1/reports/sellorders", [auth.verifytoken, auth.isAdmin], reportController.getSellorderReports);

    /**
    * Define the route for getting a stock details report
    * 
    * POST /stockapplication/api/v1/reports/stocks -> report Controller getSellorderReports method
    */
    app.get("/stockapplication/api/v1/reports/stocks", [auth.verifytoken, auth.isAdmin], reportController.getCurrentStockReports);

}