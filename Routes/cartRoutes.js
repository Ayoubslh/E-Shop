const express = require('express');
const cartController = require('./../controllers/cartController');
const authController = require('./../controllers/authController');



const router = express.Router();
router.route('/').get(authController.protect,cartController.getCart);
router.route('/add').post(authController.protect,cartController.addItemToCart);
router.route('/delete').delete(authController.protect,cartController.deleteItemFromCart);




module.exports = router;