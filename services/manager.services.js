
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const { db } = require("../config/db.config.js");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");



async function CreateBook({ req, token }, callback) {

    if (req.body.title === undefined) {
        return callback({ message: "Title Required!" });
    }
    if (req.body.ISBN === undefined) {
        return callback({ message: "ISBN Required!" });
    }
    if (req.body.author === undefined) {
        return callback({ message: "Author Required!" });
    }
    if (req.body.description === undefined) {
        return callback({ message: "Description Required!" });
    }
    if (req.body.category === undefined) {
        return callback({ message: "Category Required!" });
    }
    if (req.body.quantity === undefined) {
        return callback({ message: "Quantity Required!" });
    }
    if (req.body.price === undefined) {
        return callback({ message: "Price Required!" });
    }


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot add a new book"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Register Book"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }

                        else {

                            let library = info[0].Library_ID;

                            let selectcount = 'SELECT Count(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1';
                            let querycount = mysql.format(selectcount, [
                                "CATEGORY",
                                "Library_ID",
                                library,
                                "Category_ID",
                                req.body.category
                            ]);

                            db.query(querycount, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Category ID Entered for the Library"
                                    });
                                }
                                else {

                                    let selectQuery2 = 'SELECT Count(*) as "total" FROM ?? WHERE ?? = ? AND ?? IN (SELECT ?? FROM ?? WHERE LIBRARY_ID = ?);';
                                    let query2 = mysql.format(selectQuery2, [
                                        "BOOKS",
                                        "ISBN",
                                        req.body.ISBN,
                                        "Category_ID",
                                        "Category_ID",
                                        "CATEGORY",
                                        library
                                    ]);

                                    db.query(query2, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }
                                        if (info[0].total > 0) {
                                            return callback({
                                                message: "Book already exists in this Library"
                                            });
                                        }
                                        else {
                                            
                                    let flag = '0';
                                            db.query(`INSERT INTO BOOKS(Title, ISBN, Author, Description, Category_ID, Quantity, Price, Delete_Flag) VALUES (?, ?, ?, ?, ?, ? , ?, ?)`
                                                , [req.body.title, req.body.ISBN, req.body.author, req.body.description, req.body.category, req.body.quantity, req.body.price, flag],
                                                (error, results, fields) => {
                                                    if (error) {
                                                        return callback(error);
                                                    }

                                                    return callback(null, "Book Added Successfully!")
                                                });
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

async function CreateCategory({ req, token }, callback) {

    if (req.body.name === undefined) {
        return callback({ message: "Name Required!" });
    }
    if (req.body.parent === undefined) {
        return callback({ message: "Parent Category ID Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot add a new book"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {

                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation, unable to add Category"
                    });
                }

                else {

                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }

                        else {

                            let library = info[0].Library_ID;


                            let selectQuery2 = 'SELECT Count(*) as "total" FROM ??  WHERE ?? = ? AND ?? = ? ;';
                            let query2 = mysql.format(selectQuery2, [
                                "CATEGORY",
                                "Name",
                                req.body.name,
                                "Library_ID",
                                library,
                            ]);

                            db.query(query2, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total > 0) {
                                    return callback({
                                        message: "Category already exists in this library"
                                    });
                                }
                                else {
                                    db.query(`INSERT INTO CATEGORY(Name, Parent_Category, Library_ID) VALUES (?, ?, ?)`, [req.body.name, req.body.parent, library],
                                        (error, results, fields) => {
                                            if (error) {
                                                return callback(error);
                                            }

                                            return callback(null, "Category Created Successfully!")
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

async function updateBook({ req, token }, callback) {

    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book ID is Required!" });
    }
    if (req.body.title === undefined) {
        return callback({ message: "Title Required!" });
    }
    if (req.body.ISBN === undefined) {
        return callback({ message: "ISBN Required!" });
    }
    if (req.body.description === undefined) {
        return callback({ message: "Description Required!" });
    }
    if (req.body.quantity === undefined) {
        return callback({ message: "Quantity Required!" });
    }


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot update book"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Book"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            let bookc = 'SELECT count(*) as "total" FROM ??   WHERE ?? = ?';
                            let queryc = mysql.format(bookc, ["BOOKS", "Book_ID", req.body.Book_ID]);


                            // Checking if recieved book id is an actual book id in database
                            db.query(queryc, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Error! Invalid Book ID"
                                    });
                                }

                                else {


                                    let bookc = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                                    let queryc = mysql.format(bookc, ["CATEGORY", "BOOKS", "Category_ID", "Category_ID", "Book_ID", req.body.Book_ID]);


                                    // Checking if recieved book ID's library matches managers library id
                                    db.query(queryc, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }
                                        if (info[0].Library_ID != library) {
                                            return callback({
                                                message: "Access Violation! Unable to update book information"
                                            });
                                        }
                                        else {
                                            // UPDATE Query
                                            let updateQuery = 'UPDATE BOOKS SET   ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
                                            let query = mysql.format(updateQuery, ["Title", req.body.title, "Description", req.body.description, "quantity", req.body.quantity, "Book_ID", req.body.Book_ID]);

                                            db.query(query, (err, info) => {
                                                if (err) {
                                                    return callback(err);
                                                }

                                                return callback(null, "Book Information Updated Successfully!")
                                            });

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

async function updateOrderStatusManager({ req, token }, callback) {

    if (req.body.Order_ID === undefined) {
        return callback({ message: "Order ID Required!" });
    }
    if (req.body.status === undefined) {
        return callback({ message: "Order Status Required!" });
    }



    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot update order status"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Order Status"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);



                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            // need to check whtehr this order if of this library or not
                            let selectQuery = 'select COUNT(*) as "total" from ?? where ?? = ? AND ?? IN (select ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                            let query = mysql.format(selectQuery, ["ORDER_ITEMS", "Order_ID", req.body.order, "Book_ID", "Book_ID", "Books", "category_ID", "Category_ID", "Category", "Library_ID", req.body.library]);

                            db.query(query, (err, order_items) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total == 0) {
                                    return callback({
                                        message: "Invalid Order ID/Library ID"
                                    });
                                }

                                else {

                                    // UPDATE Query
                                    let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                                    let query = mysql.format(updateQuery, ["ORDERS", "Status", req.body.status, "Order_ID", req.body.Order_ID]);

                                    db.query(query, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        return callback(null, "Order Status Updated Successfully!")
                                    });

                                }


                            });

                        }

                    });

                }
            });

        };

    });

};

async function updateBookFlag({ req, token }, callback) {


    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book ID Required!" });
    }
    if (req.body.flag === undefined) {
        return callback({ message: "Delete Flag Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot update books flag"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Order Status"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);



                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Category_ID", "Category_ID", "Category", "Library_ID", library]);

                            db.query(querylib3, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Book ID for Library"
                                    });
                                }
                                else {

                                    // UPDATE Query
                                    let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                                    let query = mysql.format(updateQuery, ["BOOKS", "Delete_Flag", req.body.flag, "Book_ID", req.body.Book_ID]);

                                    db.query(query, (err, info) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        return callback(null, "Book delete flag Updated Successfully!")
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

async function getOrdersLibrary({ token }, callback) {


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot get Orders"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            //     Query update
                            let selectQuery = 'select DISTINCT(??)  from ?? where ?? IN (select ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                                let query = mysql.format(selectQuery, ["Order_ID", "order_items", "Book_ID", "Book_ID","Books","Category_ID","Category_ID", "Category", "Library_ID", library]);

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
                }
            });
        }

    });
};

async function getBooksLibrary({ token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot Get books"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;



                            let selectQuery = `SELECT Book_ID, Title,  Price, Book_Image, Quantity, C.Category_ID, Delete_Flag FROM ?? As B INNER JOIN ?? As C ON B.??=C.?? INNER JOIN ?? L ON C.??=L.?? WHERE C.?? = ?`;
                            let query = mysql.format(selectQuery, ["BOOKS", "CATEGORY", "Category_ID", "Category_ID", "LIBRARIES", "Library_ID", "Library_ID", "Library_ID", library]);


                            db.query(query, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                else {
                                    return callback(null, { data });
                                };

                            })

                        };

                    });

                }


            });
        };

    });

};

async function getOneBookLibrary({ req, token }, callback) {


    if (req.body.book === undefined) {
        return callback({ message: "Book ID Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot Get books"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                            let querylib3 = mysql.format(lib, [req.body.book, "Book_ID", "Books", "Category_ID", "Category_ID", "Category", "Library_ID", library]);

                            db.query(querylib3, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Book ID for Library"
                                    });
                                }
                                else {
                                    let selectQuery = `SELECT A.Book_ID, A.Title, A.ISBN, A.Author, A.Price, A.Quantity, A.Description, A.Book_Image, A.Delete_Flag, A.Category_ID, C.Name AS "Category Name" FROM ?? AS A INNER JOIN ?? AS C ON A.?? =  C.?? WHERE ?? = ?`;
                                    let query = mysql.format(selectQuery, ["BOOKS", "CATEGORY", "Category_ID", "Category_ID", "Book_ID", req.body.book]);

                                    db.query(query, (err, data) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        else {

                                            return callback(null, { data });
                                        };
                                    })
                                }
                            })
                        }
                    })
                };

            });

        }

    });

};

async function getCategoryLibrary({ token }, callback) {

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot Get Categories"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            let selectQuery3 = 'SELECT  ??, ?? FROM ?? WHERE ?? = ?';
                            let query3 = mysql.format(selectQuery3, ["Name", "Category_ID", "CATEGORY", "Library_ID", library]);
                            db.query(query3, (err, Categories) => {
                                if (err) {
                                    return callback(err);
                                }
                                else {

                                    return callback(null, { Categories });
                                };
                            })
                        }
                    });
                }
            });
        };

    });

};

async function seeReviews({ req, token }, callback) {

    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book ID Required!" });
    }


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot see reviews!"
            });
        } else {
            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;


                            // Book id check for library

                            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Category_ID", "Category_ID", "Category", "Library_ID", library]);

                            db.query(querylib3, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Book ID for Library"
                                    });
                                }
                                else {

                                    let selectQuery3 = 'SELECT  ??, ?? FROM ?? WHERE ?? = ?';
                                    let query3 = mysql.format(selectQuery3, ["Review", "Rating", "REVIEWS", "Book_ID", req.body.Book_ID]);
                                    db.query(query3, (err, Reviews) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        else {
                                            return callback(null, { Reviews });

                                        };

                                    })
                                }
                            });


                        }



                    });

                }

            });
        }

    });

};

async function deleteReview({ req, token }, callback) {

    if (req.body.Book_ID === undefined) {
        return callback({ message: "Book ID Required!" });
    }
    if (req.body.User_ID === undefined) {
        return callback({ message: "User ID Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot see reviews!"
            });
        } else {
            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                            // check if book id is of this library

                            let lib = 'SELECT COUNT(*) as "total" where ? IN (SELECT ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                            let querylib3 = mysql.format(lib, [req.body.Book_ID, "Book_ID", "Books", "Category_ID", "Category_ID", "Category", "Library_ID", library]);

                            db.query(querylib3, (err, info) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (info[0].total != 1) {
                                    return callback({
                                        message: "Invalid Book ID for Library"
                                    });
                                }
                                else {

                                    let selectQuery3 = 'SELECT  COUNT(*) as "total" FROM ?? WHERE ?? = ? AND ?? = ?';
                                    let query3 = mysql.format(selectQuery3, ["REVIEWS", "Book_ID", req.body.Book_ID, "User_ID", req.body.User_ID]);
                                    db.query(query3, (err, Reviews) => {
                                        if (err) {
                                            return callback(err);
                                        }

                                        if (Reviews[0].total == 0) {
                                            return callback({
                                                message: "Review does not exist!"
                                            });
                                        }
                                        else {
                                            db.query('DELETE FROM ?? WHERE ?? = ? AND ?? = ?', ["REVIEWS", "User_ID", req.body.User_ID, "Book_ID", req.body.Book_ID],
                                                (error, results, fields) => {
                                                    if (error) {
                                                        return callback(error);
                                                    }
                                                    return callback(null, { message: 'Review deleted successfully!' });
                                                });

                                        };

                                    })
                                }


                            });
                        }

                    });

                }

            });
        }
    })
};

async function getOrder_ItemsManager({req, token}, callback) {


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

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Wrong User Type"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }

                        else {

                            let library = info[0].Library_ID;

                            

                                let selectQuery = 'select COUNT(*) as "total" from ?? where ?? = ? AND ?? IN (select ?? from ?? where ?? IN (SELECT ?? from ?? where ?? = ?))';
                                let query = mysql.format(selectQuery, ["order_items", "order_ID", req.body.order, "Book_ID", "Book_ID", "Books", "category_ID", "Category_ID", "Category", "Library_ID", req.body.library]);

                                db.query(query, (err, order_items) => {
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

async function getQueries({ token }, callback) {


    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot View Queries"
            });
        }
        else {

            let selectQuery = 'SELECT ??, A1.?? FROM ?? as A1 INNER JOIN ??  as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["Type", "User_ID", "USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }

                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation!"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                         
                                let selectQuery = 'SELECT ??,??, ??, ??, ?? from ?? as A where A.?? = ?';
                                let query = mysql.format(selectQuery, ["Query_ID","Viewed_Flag","Subject", "Description", "Name", "CONTACT_US","Library_ID", library]);

                                db.query(query, (err, Queries) => {
                                    if (err) {
                                        return callback(err);
                                    }
                                    else {
                                        return callback(null, { Queries });
                                    }
                                });
                            }
                        
                    });
                }
            });
        }
    });
};

async function statusQuery({ req, token }, callback) {

    if (req.body.Query === undefined) {
        return callback({ message: "Query ID Required!" });
    }

    let selectQuery = 'SELECT COUNT(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
    let query = mysql.format(selectQuery, ["TOKENS_USER", "Token", token]);
    db.query(query, (err, data) => {
        if (err) {
            return callback(err);
        }

        if (data[0].total == 0) {
            return callback({
                message: "Deleted Token, Cannot update book"
            });
        }
        else {

            let selectQuery = 'SELECT Type FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??  WHERE ?? = ?';
            let query = mysql.format(selectQuery, ["USERS", "TOKENS_USER", "User_ID", "User_ID", "Token", token]);

            db.query(query, (err, info) => {
                if (err) {
                    return callback(err);
                }
                if (info[0].Type != 1) {
                    return callback({
                        message: "Access Violation! Cannot Update Query Status"
                    });
                }
                else {
                    let lib = 'SELECT Library_ID FROM ?? as A1 INNER JOIN ?? as A2 ON A1.??= A2.??   WHERE ?? = ?';
                    let querylib = mysql.format(lib, ["Libraries", "TOKENS_USER", "Manager_ID", "User_ID", "Token", token]);

                    db.query(querylib, (err, info) => {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            let library = info[0].Library_ID;

                                let lib = 'Select COUNT(*) as "total" from ?? where ? IN (select ?? from ?? where ?? = ?)';
                                let querylib = mysql.format(lib, ["CONTACT_US", req.body.query, "Query_ID", "CONTACT_US", "Library_ID", library]);

                                db.query(querylib, (err, info) => {
                                    if (err) {
                                        return callback(err);
                                    }
                                    if (data[0].total == 0) {
                                        return callback({
                                            message: "Invalid Query ID"
                                        });
                                    }
                                    else {
                                          // UPDATE Query
                                          let temp = '1';
                                          let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                                          let query = mysql.format(updateQuery, ["CONTACT_US", "Viewed_Flag", temp, "Query_ID", req.body.query]);

                                          db.query(query, (err, info) => {
                                              if (err) {
                                                  return callback(err);
                                              }

                                              return callback(null, "Query Status Updated Successfully!")
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


module.exports = {
    CreateBook,
    CreateCategory,
    updateBook,
    updateOrderStatusManager,
    getOrdersLibrary,
    updateBookFlag,
    getBooksLibrary,
    getOneBookLibrary,
    getCategoryLibrary,
    deleteReview,
    seeReviews,
    getOrder_ItemsManager,
    getQueries,
    statusQuery
    
};