const bcryptjs = require('bcryptjs');
const userService = require("../services/manager.services");

exports.CreateBook = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    userService.CreateBook({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.CreateCategory = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    userService.CreateCategory({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.updateBook = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.updateBook({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.updateBookFlag = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.updateBookFlag({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.updateOrderStatusManager = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.updateOrderStatusManager({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};


exports.getOrdersLibrary = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.getOrdersLibrary({  token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                message: result
            },
        });
    })


};

exports.getBooksLibrary = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.getBooksLibrary({ token}, (error, result) => {

        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                result
            },
        });
    })
};

exports.getCategoryLibrary = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.getCategoryLibrary({ token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                result
            },
        });
    })
};

exports.getOneBookLibrary = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.getOneBookLibrary({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                result
            },
        });
    })
};

exports.seeReviews = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.seeReviews({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.deleteReview = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.deleteReview({ req,token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                message: result
            },
        });
    })


};

exports.getOrder_ItemsManager = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.getOrder_ItemsManager({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                message: result
            },
        });
    })
};

exports.getQueries = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.getQueries({  token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.statusQuery = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.statusQuery({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};