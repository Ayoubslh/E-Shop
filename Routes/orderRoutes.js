const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, orderController.getOrders)
  .post(authController.protect, orderController.createOrder);

router
  .route("/all")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.getallOrders
  );

router
  .route("/:id")
  .get(authController.protect, orderController.getOrder)
  .patch(authController.protect, orderController.updateOrder) //
  .delete(authController.protect, orderController.deleteOrder) 
  .patch(authController.protect,authController.restrictTo("admin") ,orderController.updateOrder)
  // consider the refund of the order along side the deletion or call it a cancelation
  //add a refund route to the order routes
  //add a refund controller to the controllers folder
  //add a refund model to the models folder
module.exports = router;
