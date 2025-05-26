const controlfactory = require("./../utils/handlerFactory");
const Cart = require("./../models/Cart");
const Product = require("./../models/Item");
const User = require("./../models/User");
const AppError = require("./../utils/appError");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return next(new AppError("You are not authorized", 401));
    const cart = await Cart.findOne({ user: userId })
      .populate({path:"items",select:"-__v -createdAt -updatedAt"})
      .populate({
        path: "user",
        select:
          "-__v -password -updatedAt -_id -passwordResetToken -passwordResetExpires -createdAt -role",
      });
    if (!cart) return next(new AppError("Cart not found", 404));
    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    if (!req.body.item) req.body.item = req.params.itemid;
    const userId = req.user.id;
    if (!userId) return next(new AppError("You are not authorized ", 403));

    const quantity = req.body.quantity || 1;
    const product = await Product.findById(req.body.item);
    if (!product) return next(new AppError("Product not found", 404));
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: req.body.item, quantity }],
      });
      newCart.items.push({ product: req.body.item, quantity });
      await newCart.save();
      return res.status(201).json({
        status: "success",
        data: {
          cart: newCart,
        },
      });
    }
    const item = cart.items.find((item) => item.product == req.body.productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: req.body.productid, quantity });
    }
    await cart.save();
    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.deleteItemFromCart = async (req, res, next) => {
  try {
    if (!req.body.userId) req.body.userId = req.user.id;
    const cart = await Cart.findOne({ user: req.body.userId });
    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart is empty",
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product == req.body.productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Item not found in cart",
      });
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(204).json({
      status: "success",
      message: "Item removed from cart",
      data: null,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
