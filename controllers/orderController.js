const Order = require('./../models/Order');
const AppError = require('../utils/appError');

exports.getOrders = async (req, res, next) => {
    try {
        const userId = req.user.id; ;
        if (!userId) return next(new AppError("You are not authorized", 401));
        const orders = await Order.find({user: userId })
.populate({
  path: "items.product",
  select: "name brand image price",
})

        .populate({
          path: "user",
          select: "-__v -password -updatedAt -_id -passwordResetToken -passwordResetExpires -createdAt -role"
        })
        .select("-__v -updatedAt"); 
       if (orders.length==0) return next(new AppError('Orders not found', 404));
        res.status(200).json({
            status: 'success',
            result: orders.length,
            data: {
                orders
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
};
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return next(new AppError("User not found", 404));
    const orderid = crypto.randomBytes(4).toString("hex").toUpperCase();

    const { items, totalPrice, deliveryDate, shippingAddress } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0)
      return next(new AppError("Items are required", 400));
    if (!totalPrice)
      return next(new AppError("Total price is required", 400));
    if (!deliveryDate)
      return next(new AppError("Delivery date is required", 400));
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.zip ||
      !shippingAddress.country
    ) {
      return next(new AppError("Complete shipping address is required", 400));
    }

    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
      deliveryDate,
      shippingAddress,
      orderid
    });

    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};


exports.getOrder = async (req, res, next) => {
    try {
        const userId = req.body.user;
        if (!userId) return next(new AppError("You are not authorized", 401));
        const order = await Order.findOne({ user: userId, _id: req.params.id }) .populate({
  path: "items.product",
  select: "name brand image price",
})

          .populate({
            path: "user",
            select: "-__v -password -updatedAt -_id -passwordResetToken -passwordResetExpires -createdAt -role"
          })
          .select("-__v -updatedAt"); 
        if (!order) return next(new AppError('Order not found', 404));
        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}

exports.updateOrder = async (req, res, next) => {
    try {
        const userId = req.body.user;
        if (!userId) return next(new AppError("You are not authorized", 401));
        const order = await Order.findOneAndUpdate({ user: userId, _id: req.params.id }, req.body, { new: true });
        if (!order) return next(new AppError('Order not found', 404));
        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) return next(new AppError("You are not authorized", 401));
        const order = await Order.findOneAndUpdate({ user: userId, _id: req.params.id },{status:"deactivated"}, { new: true });
        if (!order) return next(new AppError('Order not found', 404));
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}

exports.getallOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
        .populate({
          path: "items.product",
          select: "-__v -_id" // Exclude fields from the 'product' model
        })
        .populate({
          path: "user",
          select: "-__v -password -updatedAt -_id -passwordResetToken -passwordResetExpires -createdAt -role"
        })
        .select("-__v -updatedAt"); // Exclude fields from the main 'Order' document
       if (!orders) return next(new AppError('Orders not found', 404));
        res.status(200).json({
            status: 'success',
            data: {
                orders
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return next(new AppError('Order not found', 404));
        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}

exports.getOrdersByStatus = async (req, res, next) => {
    try {
        const orders = await Order.find({ status: req.params.status }).populate('items.product').populate('user').select('-__v -updatedAt -user.__v -user.password -user.updatedAt -user._id  -items._id -items.__v');
        if (!orders) return next(new AppError('Orders not found', 404));
        res.status(200).json({
            status: 'success',
            data: {
                orders
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}

