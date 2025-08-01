const favuriteController = require("../controllers/favouriteController");
const authcontroller = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authcontroller.protect, favuriteController.getFavourites)
  .post(authcontroller.protect, favuriteController.addToFavourites);

router
  .route("/:id")
  .delete(authcontroller.protect, favuriteController.removeFromFavourites);


module.exports = router;