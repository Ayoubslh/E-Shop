const express = require("express");
const itemController = require("./../controllers/itemController");
const reviewRouter = require("./reviewRoutes");
const authcontroller = require("./../controllers/authController");
const upload = require("./../utils/multerConfig");
const router = express.Router();

router
  .route("/")
  .get(itemController.getAllItems)
  .post(
    // authcontroller.protect,
    // authcontroller.restrictTo("admin"),
    upload.single('image'), // Add multer middleware
    itemController.createItem
  );
router
  .route("/:id")
  .get(itemController.getItem)
  .patch(
    authcontroller.protect,
    authcontroller.restrictTo("admin"),
    upload.single('image'), // Add multer middleware for updates too
    itemController.updateItem
  )
  .delete(
    authcontroller.protect,
    authcontroller.restrictTo("admin"),
    itemController.deleteItem
  );

router.use("/:itemid/reviews", reviewRouter);

module.exports = router;
