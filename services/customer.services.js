
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const { db } = require("../config/db.config.js");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");

async function getBooks({ req }, callback) {

    let selectQuery = `SELECT ??,??, ??, ??, ??, ??, ?? FROM ??`
    let query = mysql.format(selectQuery, ["Book_ID", "Category_ID", "Title", "Author", "Price", "Book_Image", "Library_ID", "BOOKS"]);


    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "No Books to show!"
            });
        }
        else {
            return callback(null, { data });
        };

    })

        ;

};

async function getOneBook({ req, token }, callback) {

    let flag = 0;
        if (req.body.book === undefined) {
        return callback({ message: "Book ID Required!" });
    }

    else {
        let selectQuery = `SELECT Book_ID, Title, ISBN, Author, Price, Book_Image, Description, Quantity FROM ?? WHERE ?? = ? AND ??=?`;
        let query = mysql.format(selectQuery, ["BOOKS", "Book_ID", req.body.book,"Delete_Flag",flag]);

        db.query(query, (err, book) => {
            if (err) {
                return callback(err);
            }
            else {

                return callback(null, { book });
            };
        })
    }
}

async function getBookCategoryWise({ req }, callback) {

    if (req.body.library === undefined) {
        return callback({ message: "Library ID Required!" });
    }

    if (req.body.category === undefined) {
        return callback({ message: "Category ID Required!" });
    }

    let lib = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ?';
    let querylib = mysql.format(lib, ["Libraries", "Library_ID", req.body.library]);

    db.query(querylib, (err, info) => {
        if (err) {
            return callback(err);
        }
        if (info[0].total != 1) {
            return callback({
                message: "Invalid Library ID"
            });
        }

        else {

            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? = ?)';
            let querylib2 = mysql.format(lib, [req.body.category, "Category_ID", "Category", "Library_ID", req.body.library]);

            db.query(querylib2, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].total != 1) {
                    return callback({
                        message: "No such Category exists!"
                    });
                }
                else {

                    let selectQuery3 = 'SELECT ??, ?? FROM ?? where ?? = ?';
                    let query3 = mysql.format(selectQuery3, ["Name", "Category_ID", "CATEGORY", "Library_ID", req.body.library]);
                    db.query(query3, (err, Categories) => {
                        if (err) {
                            return callback(err);
                        }

                        if (Categories[0].total == 0) {
                            return callback({
                                message: "No Categories to show!"
                            });
                        }
                        else {
                            let flag = '0';
                            let selectQuery = `SELECT Book_ID, Title, Author, Price, Book_Image FROM ?? As B INNER JOIN ?? As C ON B.??=C.?? WHERE B.?? = ? AND B.?? = ?`;
                            let query = mysql.format(selectQuery, ["BOOKS", "CATEGORY", "Category_ID", "Category_ID", "Category_ID", req.body.category, "Delete_Flag", flag]);

                            db.query(query, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }

                                else {

                                    return callback(null, { data, Categories });
                                };
                            });
                        };
                    });
                }
            });
        }
    });
};

async function order({ req, token }, callback) {

    if (req.body.library === undefined) {
        return callback({ message: "Library ID Required!" });
    }
    if (req.body.books === undefined) {
        return callback({ message: "Books Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {

            let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
            let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

            db.query(query1, (err, data) => {
                if (err) {
                    return callback(err);
                }

                else {

                    let User_ID = data[0].User_ID;

                    db.query(`INSERT INTO ORDERS(User_ID, Order_Date,  Status) VALUES (?, ?,  ?)`
                        , [User_ID, new Date().toISOString().slice(0, 19).replace('T', ' '), "In Progress"],
                        (error, results, fields) => {
                            if (error) {
                                return callback(error);
                            }
                            else {

                                let Order_ID = null;
                                db.query(`SELECT ?? FROM ?? WHERE ?? = ? ORDER BY ?? DESC   LIMIT 1`,
                                    ["Order_ID", "ORDERS", "USER_ID", User_ID, "Order_ID"], (error, result, fields) => {
                                        if (error) {
                                            return callback(error);
                                        }
                                        else {
                                            Order_ID = result[0].Order_ID;
                                            let User_ID = data[0].User_ID;
                                            let sum = 0;
                                            let price = 0;

                                            //console.log(req.body.books[0].quantity);
                                            for (let i = 0; i < req.body.books.length; i++) {
                                                let sQuery = 'SELECT ??,?? FROM ?? WHERE ?? = ? LIMIT 1';
                                                let mainQuery = mysql.format(sQuery, ["Price", "Quantity", "BOOKS", "Book_ID", req.body.books[i].Book_ID]);
                                                db.query(mainQuery, (err, info) => {
                                                    if (err) {
                                                        return callback(err);
                                                    }

                                                    else {
                                                        sum = sum + (info[0].Price * req.body.books[i].quantity * req.body.books[i].period);
                                                        price = (info[0].Price * req.body.books[i].quantity * req.body.books[i].period);

                                                        db.query(`INSERT INTO ORDER_ITEMS(Order_ID, Book_ID, Quantity, Start_Date, Period, Line_Total) VALUES (?, ?, ?, ?, ?, ?)`
                                                            , [Order_ID, req.body.books[i].Book_ID, req.body.books[i].quantity, new Date().toISOString().slice(0, 19).replace('T', ' '), req.body.books[i].period, price],
                                                            (error, results, fields) => {
                                                                if (error) {
                                                                    return callback(error);
                                                                }
                                                            });




                                                        if (i == req.body.books.length - 1) {
                                                            let updateQuery = 'UPDATE ?? SET ?? = ?  WHERE ?? = ?';
                                                            let query = mysql.format(updateQuery, ["ORDERS", "Total_Price", sum, "Order_ID", Order_ID]);

                                                            db.query(query, (err, info) => {
                                                                if (err) {
                                                                    return callback(err);
                                                                }
                                                            });

                                                        }


                                                        let updateQuery = 'UPDATE ?? SET ?? = ?? - ?   WHERE ?? = ?';
                                                        let query = mysql.format(updateQuery, ["BOOKS", "Quantity", "Quantity", req.body.books[i].quantity, "Book_ID", req.body.books[i].Book_ID]);

                                                        db.query(query, (err, info) => {
                                                            if (err) {
                                                                return callback(err);
                                                            }


                                                        });
                                                    }
                                                });
                                            }

                                            return callback(null, "Order Placed Successfully");
                                        }
                                    });
                            }
                        });
                }
            });

        }
    });


};

async function getOrdersCustomer({ req, token }, callback) {

    if (req.body.library === undefined) {
        return callback({ message: "Name is Required!" });
    }

    let selectQuery = 'SELECT ??,COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["User_ID", "TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }

        else {


            let selectQuery = 'SELECT * from ?? where ?? = ?';
            let query = mysql.format(selectQuery, ["ORDERS", "User_ID", data[0].User_ID]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null, { info });
                }
            });
        }


    });

};

async function getOrder_ItemsCustomer({ req, token }, callback) {



    if (req.body.library === undefined) {
        return callback({ message: "Library_ID is Required!" });
    }

    if (req.body.order === undefined) {
        return callback({ message: "Order_ID is Required " });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {
            let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
            let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

            db.query(query1, (err, data) => {
                if (err) {
                    return callback(err);
                }
                else {

                    let User_ID = data[0].User_ID;

                    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ?';
                    let query = mysql.format(selectQuery, ["ORDERS", "User_ID", User_ID]);

                    db.query(query, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        if (data[0].total == 0) {
                            return callback({
                                message: "Invalid Order ID"
                            });
                        }
                        else {

                            let selectQuery = 'select COUNT(*) as "total" from ?? where ?? = ? AND ?? IN (select ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                            let query = mysql.format(selectQuery, ["order_items", "order_ID", req.body.order, "Book_ID", "Book_ID", "Books", "category_ID", "Category_ID", "Category", "Library_ID", req.body.library]);

                            db.query(query, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total == 0) {
                                    return callback({
                                        message: "Invalid Order ID/Library ID"
                                    });
                                }
                                else {


                                    let selectQuery = 'SELECT B.??,B.??,B.??,A.??,A.??,A.?? FROM ?? as A INNER JOIN ?? as B ON A.?? = B.??  WHERE A.?? = ?';
                                    let query = mysql.format(selectQuery, ["Title", "Author", "Price", "Quantity", "Period", "Line_Total", "ORDER_ITEMS", "BOOKS", "Book_ID", "Book_ID", "Order_ID", req.body.order]);

                                    db.query(query, (err, order_items) => {
                                        if (err) {
                                            return callback(err);
                                        }
                                        else {
                                            return callback(null, { order_items });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

        }
    });

};

async function newsletter({ req }, callback) {

    if (req.body.email === undefined) {
        return callback({ message: "Email is Required!" });
    }

    db.query('INSERT INTO NEWSLETTER(Email) VALUES (?)', [req.body.email], // Imserting
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, "Subsribed to our newsletter!")
        });

};

async function CustomerContact({ req, token }, callback) {

    if (req.body.library === undefined) {
        return callback({ message: "Library ID is Required!" });
    }
    if (req.body.subject === undefined) {
        return callback({ message: "Subject is Required!" });
    }
    if (req.body.name === undefined) {
        return callback({ message: "Name is Required!" });
    }
    if (req.body.description === undefined) {
        return callback({ message: "Description is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total", B.?? FROM ?? as A INNER JOIN ?? as B on A.?? = B.?? WHERE ?? = ? ';
    let query = mysql.format(selectQuery, ["Email", "TOKENS_USER", "USERS", "User_ID", "User_ID", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access profile"
            });
        }
        else {

            email = data[0].Email;
            // Check if Library_ID actually exists
            let lib = 'SELECT COUNT(*) as "total" from ?? where ?? = ?';
            let querylib = mysql.format(lib, ["Libraries", "Library_ID", req.body.library]);

            db.query(querylib, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].total == 0) {
                    return callback({
                        message: "Invalid Library ID!"
                    });

                } else {
                    let q = '0';
                    let flag = '0';
                    db.query('INSERT INTO CONTACT_US(Subject, Description, Name, Email, Library_ID, Viewed_Flag, Manager_Query) VALUES (?,?, ?, ?, ?, ?, ?)'
                        , [req.body.subject, req.body.description, req.body.name, email, req.body.library, flag, query],   //Inserting into database
                        (error, results, fields) => {
                            if (error) {
                                return callback(error);
                            }
                            return callback(null, "Thank You for Contacting Us!")
                        });
                }
            });

        }


    });


};

async function getReviews({ req,token }, callback) {


    if (req.body.book === undefined) {
        return callback({ message: "Book ID Required!" });
    }

    else {

        let selectQuery3 = 'SELECT  COUNT(*) as "total",??, ?? FROM ?? WHERE ?? = ?';
        let query3 = mysql.format(selectQuery3, ["Review", "Rating", "REVIEWS", "Book_ID", req.body.book]);
        db.query(query3, (err, Reviews) => {
            if (err) {
                return callback(err);
            }

            if (Reviews[0].total == 0) {
                return callback({
                    message: "No Reviews to show!"
                });
            }
            else {
                return callback(null, { Reviews });

            };

        })

    }
}
async function giveReview({ req, token }, callback) {
    if (req.body.library === undefined) {
        return callback({ message: "library is Required!" });
    }
    if (req.body.review === undefined) {
        return callback({ message: "review is Required!" });
    }
    if (req.body.rating === undefined) {
        return callback({ message: "rating is Required!" });
    }
    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book_ID is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {
            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Category_ID", "Category_ID", "Category", "Library_ID", req.body.library]);

            db.query(querylib3, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].total != 1) {
                    return callback({
                        message: "No Book found!"
                    });
                }
                else {
                    let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                    let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                    db.query(query1, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let User_ID = data[0].User_ID;

                            let q = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1';
                            let q2 = mysql.format(q, ["REVIEWS", "User_ID", User_ID, "Book_ID", req.body.Book_ID])
                            db.query(q2, (err, ans) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (ans[0].total > 0) {
                                    return callback({
                                        message: "User has already given review on the book!"
                                    })
                                }
                                else {
                                    db.query(`INSERT INTO REVIEWS(User_ID, Book_ID, Review, Rating) VALUES (?, ?, ?, ?)`, [User_ID, req.body.Book_ID, req.body.review, req.body.rating], (error, results, fields) => {
                                        if (error) {
                                            return callback(error);
                                        }
                                        else {
                                            return callback(null, "Review posted!");
                                        }
                                    });
                                }
                            })
                        }
                    });
                }

            })


        }
    });
};

async function updateReview({ req, token }, callback) {
    if (req.body.library === undefined) {
        return callback({ message: "library is Required!" });
    }
    if (req.body.review === undefined) {
        return callback({ message: "review is Required!" });
    }
    if (req.body.rating === undefined) {
        return callback({ message: "rating is Required!" });
    }
    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book_ID is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {
            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Category_ID", "Category_ID", "Category", "Library_ID", req.body.library]);

            db.query(querylib3, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].total != 1) {
                    return callback({
                        message: "No Book found!"
                    });
                }
                else {
                    let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                    let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                    db.query(query1, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let User_ID = data[0].User_ID;

                            let q = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1';
                            let q2 = mysql.format(q, ["REVIEWS", "User_ID", User_ID, "Book_ID", req.body.Book_ID])
                            db.query(q2, (err, ans) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (ans[0].total == 0) {
                                    return callback({
                                        message: "No such review exists"
                                    })
                                }
                                else {

                                    // UPDATE Query
                                    let updateQuery = 'UPDATE ?? SET  ?? = ? , ?? = ? WHERE ?? = ? AND ?? = ?';
                                    let query = mysql.format(updateQuery, ["REVIEWS", "Review", req.body.review, "Rating", req.body.rating, "User_ID", User_ID, "Book_ID", req.body.Book_ID]);

                                    db.query(query, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        return callback(null, "Review Updated Successfully!")
                                    });
                                }
                            })
                        }
                    });
                }

            })


        }
    });
};

async function deleteReview({ req, token }, callback) {
    if (req.body.library === undefined) {
        return callback({ message: "library is Required!" });
    }
    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book_ID is Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot access Order"
            });
        }
        else {
            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Category_ID", "Category_ID", "Category", "Library_ID", req.body.library]);

            db.query(querylib3, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].total != 1) {
                    return callback({
                        message: "No Book found!"
                    });
                }
                else {
                    let selectQuery1 = 'SELECT User_ID FROM ?? WHERE ?? = ? LIMIT 1';
                    let query1 = mysql.format(selectQuery1, ["TOKENS_USER", "Token", token]);

                    db.query(query1, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let User_ID = data[0].User_ID;

                            let q = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1';
                            let q2 = mysql.format(q, ["REVIEWS", "User_ID", User_ID, "Book_ID", req.body.Book_ID])
                            db.query(q2, (err, ans) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (ans[0].total == 0) {
                                    return callback({
                                        message: "No such review exists"
                                    })
                                }
                                else {
                                    db.query('DELETE FROM ?? WHERE ?? = ? AND ?? = ?', ["REVIEWS", "User_ID", User_ID, "Book_ID", req.body.Book_ID],
                                        (error, results, fields) => {
                                            if (error) {
                                                return callback(error);
                                            }
                                            return callback(null, { message: 'Review deleted successfully!' });
                                        });


                                }
                            })
                        }
                    });
                }

            })


        }
    });
};


async function getEvents({ req }, callback) {

    let lib = 'SELECT COUNT(*) as "total" FROM ?? ';
    let querylib = mysql.format(lib, ["EVENTS"]);

    db.query(querylib, (err, info) => {
        if (err) {
            return callback(err);
        }
        else if (info[0].total < 1) {
            return callback({
                message: "No events to show!"
            });
        }

        else {

            let selectQuery3 = 'SELECT * FROM ?? ';
            let query3 = mysql.format(selectQuery3, ["EVENTS"]);
            db.query(query3, (err, results) => {
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null, { results });
                }
            })

        }
    })
};

module.exports = {

    newsletter,
    getOneBook,
    getBooks,
    getBookCategoryWise,
    order,
    getOrdersCustomer,
    getOrder_ItemsCustomer,
    CustomerContact,
    deleteReview,
    updateReview,
    giveReview,
    getReviews,
    getEvents

};