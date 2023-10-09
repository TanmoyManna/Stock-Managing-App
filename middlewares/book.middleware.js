// Middleware to validate the book req body
const validateBooksBody = async (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).send({
            message: "Name of the book is missing.",
        });
    }

    if (!req.body.authorName) {
        return res.status(400).send({
            message: "Author Name of the book is missing.",
        });
    }
    next();
};

module.exports = {
    validateBooksBody: validateBooksBody
};
