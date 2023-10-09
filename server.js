// This will be the starting point of the application

// Importing Config Files
const serverConfig = require("./configs/server.config");

// Importing express framework, initializing the database and creating the connection
const express = require("express");
const app = express();
require('./initDataBase')();
// const connectionPool = require('./configs/db.config');

// Importing CORS and using it in our app
const cors = require('cors')
app.use(cors())

// Importing bodyParser and using it in app To convert JSON to Js Objects and vice versa
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
* Plugging in the routes
*/
require("./routes/auth.route")(app);
require("./routes/book.route")(app);
require("./routes/warehouse.route")(app);
require("./routes/sellorder.route")(app);
require("./routes/purchaseorder.route")(app);
require("./routes/report.route")(app);

// To start  our server
app.listen(serverConfig.PORT, async () => {
  console.log(`Server started on port ${serverConfig.PORT}`);
});