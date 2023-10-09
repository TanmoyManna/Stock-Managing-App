// this file have the logic to manage reports
const fs = require('fs');
const ExcelJS = require('exceljs');
const connectionPool = require('../configs/db.config');
/**
 * Create a function to allow the user to get purchase order reports
 *
 * when a user calls the endpoint:
 * GET stockapplication/api/v1/reports/purchaseorders , router should call the below method
 */
exports.getPurchaseorderReports = async (req, res) => {
    try {
        if (req.query.fromDate && req.query.toDate) {

            if (new Date(req.query.fromDate) > new Date(req.query.toDate)) {
                return res.status(400).send({
                    message: "Invalid date range. fromDate must be before toDate.",
                    status: 400
                });
            }
        }

        let query = `SELECT purchaseorders.id, purchaseorders.quantity AS purchasedQuantity, purchaseorders.created_at, books.name AS bookName, books.authorName, warehouses.name AS warehouseName, warehouses.location AS warehouseLocation
        FROM purchaseorders
        INNER JOIN warehouses ON purchaseorders.warehouseId = warehouses.id
        INNER JOIN books ON purchaseorders.bookId = books.id`;


        if (Object.keys(req.query).length) {
            query += ` WHERE`;
            const conditions = [];
            if (req.query.bookId) {
                conditions.push(` purchaseorders.bookId = ${req.query.bookId}`);
            }
            if (req.query.warehouseId) {
                conditions.push(` purchaseorders.warehouseId = ${req.query.warehouseId}`);
            }
            if (req.query.fromDate) {
                conditions.push(` purchaseorders.created_at >= '${req.query.fromDate}'`);
            }
            if (req.query.toDate) {
                conditions.push(` purchaseorders.created_at <= '${req.query.toDate}'`);
            }

            query += conditions.join(' AND ');
        }
        query += ` ;`;

        console.log(query)

        const [Purchaseorders, Extra] = await connectionPool.query(query);

        if (Purchaseorders.length == 0) {
            return res.status(204).send({
                status: 204,
                message: "No purchase order found to generate report"
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('purchaseorder');
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Purchased Quantity', key: 'purchasedQuantity', width: 20 },
            { header: 'Purchased At', key: 'created_at', width: 20 },
            { header: 'Book Name', key: 'bookName', width: 20 },
            { header: 'Author Name', key: 'authorName', width: 20 },
            { header: 'Warehouse Name', key: 'warehouseName', width: 20 },
            { header: 'Warehouse Location', key: 'warehouseLocation', width: 20 },
        ];

        Purchaseorders.forEach((Purchaseorder) => {
            worksheet.addRow(Purchaseorder);
        });

        const reportPath = 'Temp File-' + Date.now();

        workbook.xlsx.writeFile(reportPath).then(() => {
            // Set response headers for file download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=purchaseorder_report-' + Date.now() + '.xlsx');

            // Stream the file to the response
            const fileStream = fs.createReadStream(reportPath);
            fileStream.pipe(res);

            res.on('finish', () => {
                // Delete the file after it has been streamed and the response has finished
                fs.unlink(reportPath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            });
        })
    } catch (err) {
        console.log("Error while fetching purchase order reports", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};


/**
 * Create a function to allow the user to get sell order reports
 *
 * when a user calls the endpoint:
 * GET stockapplication/api/v1/reports/sellorders , router should call the below method
 */
exports.getSellorderReports = async (req, res) => {
    try {
        if (req.query.fromDate && req.query.toDate) {

            if (new Date(req.query.fromDate) > new Date(req.query.toDate)) {
                return res.status(400).send({
                    message: "Invalid date range. fromDate must be before toDate.",
                    status: 400
                });
            }
        }

        let query = `SELECT sellorders.id, sellorders.quantity AS selledQuantity, sellorders.created_at, books.name AS bookName, books.authorName, warehouses.name AS warehouseName, warehouses.location AS warehouseLocation, users.id AS customerId, users.name AS customerName, users.email AS customerEmail
        FROM sellorders
        INNER JOIN warehouses ON sellorders.warehouseId = warehouses.id
        INNER JOIN books ON sellorders.bookId = books.id
        INNER JOIN users ON sellorders.customerId = users.id`;


        if (Object.keys(req.query).length) {
            query += ` WHERE`;
            const conditions = [];
            if (req.query.bookId) {
                conditions.push(` sellorders.bookId = ${req.query.bookId}`);
            }
            if (req.query.warehouseId) {
                conditions.push(` sellorders.warehouseId = ${req.query.warehouseId}`);
            }
            if (req.query.customerId) {
                conditions.push(` sellorders.customerId = ${req.query.customerId}`);
            }
            if (req.query.fromDate) {
                conditions.push(` sellorders.created_at >= '${req.query.fromDate}'`);
            }
            if (req.query.toDate) {
                conditions.push(` sellorders.created_at <= '${req.query.toDate}'`);
            }
            query += conditions.join(' AND ');
        }
        query += ` ;`;


        const [Sellorders, Extra] = await connectionPool.query(query);


        if (Sellorders.length == 0) {
            return res.status(204).send({
                status: 204,
                message: "No sell order found to generate report"
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('sellorder');
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Selled Quantity', key: 'selledQuantity', width: 20 },
            { header: 'Selled At', key: 'created_at', width: 20 },
            { header: 'Book Name', key: 'bookName', width: 20 },
            { header: 'Author Name', key: 'authorName', width: 20 },
            { header: 'Warehouse Name', key: 'warehouseName', width: 20 },
            { header: 'Warehouse Location', key: 'warehouseLocation', width: 20 },
            { header: 'Customer Id', key: 'customerId', width: 15 },
            { header: 'Customer Name', key: 'customerName', width: 20 },
            { header: 'Customer Email', key: 'customerEmail', width: 30 },
        ];

        Sellorders.forEach((Sellorder) => {
            worksheet.addRow(Sellorder);
        });

        const reportPath = 'Temp File-' + Date.now();

        workbook.xlsx.writeFile(reportPath).then(() => {
            // Set response headers for file download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=sellorder_report-' + Date.now() + '.xlsx');

            // Stream the file to the response
            const fileStream = fs.createReadStream(reportPath);
            fileStream.pipe(res);

            res.on('finish', () => {
                // Delete the file after it has been streamed and the response has finished
                fs.unlink(reportPath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            });
        })
    } catch (err) {
        console.log("Error while fetching sell order reports", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};


/**
 * Create a function to allow the user to get current Stock reports
 *
 * when a user calls the endpoint:
 * GET stockapplication/api/v1/reports/stocks , router should call the below method
 */
exports.getCurrentStockReports = async (req, res) => {
    try {

        let query = `SELECT stockdetails.bookId AS bookId, stockdetails.quantity AS availableQuantity, books.name AS bookName, books.authorName, warehouses.name AS warehouseName, warehouses.location AS warehouseLocation
        FROM stockdetails
        INNER JOIN warehouses ON stockdetails.warehouseId = warehouses.id
        INNER JOIN books ON stockdetails.bookId = books.id`;


        if (Object.keys(req.query).length) {
            query += ` WHERE`;
            const conditions = [];
            if (req.query.bookId) {
                conditions.push(` stockdetails.bookId = ${req.query.bookId}`);
            }
            if (req.query.warehouseId) {
                conditions.push(` stockdetails.warehouseId = ${req.query.warehouseId}`);
            }
            query += conditions.join(' AND ');
        }
        query += ` ;`;


        const [StockDetails, Extra] = await connectionPool.query(query);


        if (StockDetails.length == 0) {
            return res.status(204).send({
                status: 204,
                message: "No Stock Details found to generate report"
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('stockDetails');
        worksheet.columns = [
            { header: 'Book Id', key: 'bookId', width: 10 },
            { header: 'Available Quantity', key: 'availableQuantity', width: 25 },
            { header: 'Book Name', key: 'bookName', width: 20 },
            { header: 'Author Name', key: 'authorName', width: 20 },
            { header: 'Warehouse Name', key: 'warehouseName', width: 20 },
            { header: 'Warehouse Location', key: 'warehouseLocation', width: 20 }
        ];

        StockDetails.forEach((StockDetail) => {
            worksheet.addRow(StockDetail);
        });

        const reportPath = 'Temp File-' + Date.now();

        workbook.xlsx.writeFile(reportPath).then(() => {
            // Set response headers for file download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=stockdetails_report-' + Date.now() + '.xlsx');

            // Stream the file to the response
            const fileStream = fs.createReadStream(reportPath);
            fileStream.pipe(res);

            res.on('finish', () => {
                // Delete the file after it has been streamed and the response has finished
                fs.unlink(reportPath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            });
        })
    } catch (err) {
        console.log("Error while fetching stock details reports", err.message);
        res.status(500).send({
            message: "Some internal server error",
            status: 500
        });
    }
};