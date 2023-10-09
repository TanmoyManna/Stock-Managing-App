const connectionPool = require('../configs/db.config');

// Middleware to validate the Registration req body
const validateRegistrationBody = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "Name of the user is missing.",
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      message: "Email of the user is missing.",
    });
  }

  if (!req.body.password) {
    return res.status(400).send({
      message: "Password of the user is missing.",
    });
  }

  if (req.body.role != undefined) {
    if (!["admin", "customer"].includes(req.body.role)) {
      return res.status(400).send({
        message: "Not a valid user role.",
      });
    }
  }

  try {
    const emailFromReq = req.body.email;
    const [userSaved, extra] = await connectionPool.query(`SELECT * FROM users WHERE email ='${emailFromReq}'`);
    if (userSaved.length > 0) {
      return res.status(409).send({
        message: "Email given is already taken, Please use another email.",
        status: 409
      });
    }
  } catch(err) {
    console.log("Error while checking if email is already present ", err.message);
    res.status(500).send({
      message: "Some internal server error",
    });
  }




  next();
};

// Middleware to validate the Login req body
const validatLoginBody = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).send({
      message: "Email of the user is missing.",
    });
  }

  if (!req.body.password) {
    return res.status(400).send({
      message: "Password of the user is missing.",
    });
  }

  next();
};

module.exports = {
  validateRegistrationBody: validateRegistrationBody,
  validatLoginBody: validatLoginBody
};
