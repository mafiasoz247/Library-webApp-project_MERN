const adminController = require("../controllers/admin.controller");
const managerController = require("../controllers/manager.controller");
const generalController = require("../controllers/general.controller");
const customerController = require("../controllers/customer.controller");

const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router();

const app = express()

router.post("/RegisterManager", adminController.RegisterManager);
router.post("/register", generalController.register);
router.post("/login", generalController.login);
router.get("/user-profile", generalController.userProfile);
router.delete("/logout", generalController.logout);
router.post("/newsletter", customerController.newsletter);

router.post("/CreateCategory", managerController.CreateCategory);
router.post("/CreateLibrary", adminController.CreateLibrary);
router.post("/CreateBook", managerController.CreateBook);

router.get("/getOneBook", customerController.getOneBook);
router.get("/getBooks", customerController.getBooks);
router.get("/getBookCategoryWise", customerController.getBookCategoryWise);

router.post("/order", customerController.order);
router.get("/getOrdersCustomer", customerController.getOrdersCustomer);
router.get("/getOrder_ItemsCustomer", customerController.getOrder_ItemsCustomer);
router.get("/getOrdersLibrary", managerController.getOrdersLibrary);

router.patch("/updateProfile", generalController.updateProfile);
router.patch("/updateBook", managerController.updateBook);

router.patch("/updateOrderStatusManager", managerController.updateOrderStatusManager)

router.post("/CustomerContact", customerController.CustomerContact);

router.get("/getUsers", adminController.viewUsers);
router.get("/getLibraries", adminController.viewLibraries);
router.patch("/setCustomerFlag", adminController.UpdateCustomerFlag);
router.patch("/setLibraryFlag", adminController.UpdateLibraryFlag);

router.patch("/setBookFlag", managerController.updateBookFlag);

router.patch("/updatePassword", generalController.updatePassword);

router.get("/getOneBookLibrary", managerController.getOneBookLibrary);
router.get("/getBooksLibrary", managerController.getBooksLibrary);
router.get("/getCategoryLibrary", managerController.getCategoryLibrary);

router.get("/getReviews", customerController.getReviews);
router.post("/giveReview",customerController.giveReview);
router.get("/seeReviewsLibrary", managerController.seeReviews);
router.delete("/deleteReviewLibrary", managerController.deleteReview);
router.patch("/updateReview", customerController.updateReview);
router.delete("/deleteReview", customerController.deleteReview);

router.get("/getQueries", managerController.getQueries);
router.patch("/statusQuery", managerController.statusQuery)
router.get("/getOrder_ItemsManager", managerController.getOrder_ItemsManager);

router.get("/getEvents", customerController.getEvents);



module.exports = router;