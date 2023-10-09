// this file have the logic to signup and signin the users

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authconfig = require("../configs/auth.config");
const connectionPool = require('../configs/db.config');
/**
 * Create a function to allow the user to signup
 *
 * when a user calls the endpoint:
 * POST stockapplication/api/v1/auth/signup  , router should call the below method
 */
exports.signup = async (req, res) => {
  // logic to handle the signup
  try {
    const userObj = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role ? req.body.role : 'customer'
    };
    const [insertedUser, insertedExtra] = await connectionPool.query (`INSERT INTO users (name, email, password, role) VALUES ('${userObj.name}', '${userObj.email}', '${userObj.password}', '${userObj.role}')`);
    const [result,extra]=await connectionPool.query (`SELECT * FROM users WHERE id = '${insertedUser.insertId}'`);
    const postResponse = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      role: result[0].role,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    };
    res.status(201).send({
      data:postResponse,
      message: "Account Created successfully",
      status:201
    });
  } catch (err) {
    console.log("Error while registering user ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};

/**
 * Create a function to allow the user to signin
 *
 * when a user calls the endpoint:
 * POST stockapplication/api/v1/auth/signin  , router should call the below method
 */
exports.signin = async (req, res) => {
  try {
    const emailFromReq = req.body.email;
    const passwordFromReq = req.body.password;

    // Ensure the userId is valid
    const [userSaved,extra] = await connectionPool.query(`SELECT * FROM users WHERE email ='${emailFromReq}'`);
    if (userSaved.length == 0) {
      return res.status(401).send({
        message: "Email given is not correct",
        status: 401
      });
    }

    // Ensure password mathes
    // Req password is in plain string
    // Database password is hashed
    // So we compare using the bcrypt
    const isValidPassword = bcrypt.compareSync(
      passwordFromReq,
      userSaved[0].password
    );

    if (!isValidPassword) {
      return res.status(401).send({
        message: "Incorrect password given",
        status: 401
      });
    }

    // We generate the access token (JWT based)
    const token = jwt.sign(
      {
        id: userSaved[0].id,
      },
      authconfig.secret,
      { expiresIn: "2h" }
    );

    // send the res back
    res.status(200).send({
      status: 200,
      data:
      {
        id: userSaved[0].id,
        name: userSaved[0].name,
        email: userSaved[0].email,
        accesstoken: token,
      },
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log("Error while sign in ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};
