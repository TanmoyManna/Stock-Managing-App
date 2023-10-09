/**
* This will have the logic to route the request to authentication controller
*/
const userMiddleware = require("../middlewares/user.middleware");
const authController = require("../controllers/auth.controller");
module.exports = (app) => {

    /**
     * Define the route for sign up
     * 
     * POST /stockapplication/api/v1/auth/signup -> auth controller signup method
     */
    app.post("/stockapplication/api/v1/auth/signup",[userMiddleware.validateRegistrationBody], authController.signup);


    /**
    * Define the route for sign in
    * 
    * POST /stockapplication/api/v1/auth/signin -> auth controller signin method
    */
    app.post("/stockapplication/api/v1/auth/signin",[userMiddleware.validatLoginBody], authController.signin);

}