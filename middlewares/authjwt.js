const jwt = require("jsonwebtoken");
const authconfig = require("../configs/auth.config");
const connectionPool = require('../configs/db.config');

// Middleware to validate the access token
const verifytoken = (req, res, next) => {
  // if the token is present
  const token = req.headers["x-access-token"];

  // checking is the token present
  if (!token) {
    return res.status(401).send({
      message: "Access token is missing",
      status: 401
    });
  }

  // checking is the token is valid
  jwt.verify(token, authconfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Invalid Access Token",
        status: 401
      });
    }
    // Fatch the userId from the token and set it to the request object
    req.userId = decoded.id;
    next();
  });
};

/**
* Middleware to go and check if the user is ADMIN
*/
const isAdmin = async (req, res, next) => {
  try {

    const [user, extra] = await connectionPool.query(`SELECT * FROM users WHERE id ='${req.userId}'`);

    if (user.length > 0 && user[0].role == "admin") {
      next();
    } else {
      return res.status(403).send({
        message: "Only admin is allowed",
        status: 403
      })
    }

  } catch (err) {
    console.log("Error while checking if user is admin ", err.message);
    res.status(500).send({
      message: "Some internal server error",
    });
  }
}

/**
* Middleware to go and check if the user is CUSTOMER
*/
const isCustomer = async (req, res, next) => {
  try {

    const [user, extra] = await connectionPool.query(`SELECT * FROM users WHERE id ='${req.userId}'`);

    if (user.length > 0 && user[0].role == "customer") {
      next();
    } else {
      return res.status(403).send({
        message: "Only customer is allowed",
        status: 403
      })
    }

  } catch (err) {
    console.log("Error while checking if user is customer ", err.message);
    res.status(500).send({
      message: "Some internal server error",
    });
  }
}


module.exports = {
  verifytoken: verifytoken,
  isAdmin: isAdmin,
  isCustomer: isCustomer
};
