// Middleware to validate the purchase order req body
const validatePurchaseorderBody = async (req, res, next) => {
  if (!req.body.bookId) {
    return res.status(400).send({
      message: "bookId is missing.",
    });
  }

  if (!req.body.warehouseId) {
    return res.status(400).send({
      message: "warehouseId is missing.",
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
    validatePurchaseorderBody: validatePurchaseorderBody,
};
