// Middleware to validate the sell order req body
const validateSellorderBody = async (req, res, next) => {
  if (!req.body.bookId) {
    return res.status(400).send({
      message: "bookId is missing.",
    });
  }

  if (!req.body.quantity) {
    return res.status(400).send({
      message: "quantity is missing.",
    });
  }

  next();
};

module.exports = {
    validateSellorderBody: validateSellorderBody,
};
