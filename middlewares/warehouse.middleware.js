// Middleware to validate the warehouse req body
const validateWarehousesBody = async (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).send({
            message: "Name of the warehouse is missing.",
        });
    }

    if (!req.body.location) {
        return res.status(400).send({
            message: "Location of the warehouse is missing.",
        });
    }
    next();
};

// Middleware to validate the transfer req body
const validateTransferBody = async (req, res, next) => {
    if (!req.body.toWarehouseId) {
        return res.status(400).send({
            message: "toWarehouseId is missing.",
        });
    }

    if (!req.body.fromWarehouseId) {
        return res.status(400).send({
            message: "fromWarehouseId is missing.",
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
    validateWarehousesBody: validateWarehousesBody,
    validateTransferBody: validateTransferBody
};
