 const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

  
 router.route('/').get(userController.getAllUsers).post(authController.protect,authController.restrictTo("admin"),userController.createUser);
// router.route('/:id').get(authController.protect,authController.restrictTo("admin"),userController.getUser).delete(authController.protect,authController.restrictTo("admin"),userController.deleteUser);

router.route('/me').get(authController.protect,userController.getMe,userController.getUser);

router.route('/signup').post(authController.signup);

router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);

router.route('/resetPassword/:token').patch(authController.resetPassword);

router.route('/updateMyPassword').patch(authController.protect,authController.updatePassword);

router.route('/updateMe').patch(authController.protect,userController.updateMe);

router.route('/deleteMe').delete(authController.protect,userController.deleteMe);

router.route('/logout').get(authController.protect,authController.logout);


module.exports = router;