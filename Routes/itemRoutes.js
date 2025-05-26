const express = require("express");
const itemController = require("./../controllers/itemController");
const reviewRouter = require("./../routes/reviewRoutes");
const authcontroller = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(itemController.getAllItems)
  .post(
    authcontroller.protect,
    authcontroller.restrictTo("admin"),
    itemController.createItem
  );
router
  .route("/:id")
  .get(itemController.getItem)
  .patch(
    authcontroller.protect,
    authcontroller.restrictTo("admin"),
    itemController.updateItem
  )
  .delete(
    authcontroller.protect,
    authcontroller.restrictTo("admin"),
    itemController.deleteItem
  );

router.use("/:itemid/reviews", reviewRouter);

module.exports = router;
