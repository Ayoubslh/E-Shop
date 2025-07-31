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
      .populate({
        path: "items.product", 
        select: "name brand image price", 
      })
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
    const userId = req.user.id;
    if (!userId) return next(new AppError("You are not authorized", 403));

    const items = req.body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError("Items must be a non-empty array", 400));
    }

    // Validate all products exist before modifying the cart
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError(`Product with ID ${item.product} not found`, 404));
      }
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    // Loop through items and update cart
    for (const item of items) {
      const productId = item.product;
      const quantity = item.quantity || 1;

      const existingItem = cart.items.find(
        (i) => i.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
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
    const cart = await Cart.findOne({ user: req.body.userId , items: { $elemMatch: { product: req.body.productId } } });
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
