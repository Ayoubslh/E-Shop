const controlfactory = require("./../utils/handlerFactory");
const Review = require("./../models/Review");
const User = require("./../models/User");
const Item = require("./../models/Item");
const AppError = require("./../utils/appError");

exports.getAllReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.itemid) filter = { item: req.params.itemid };
    const reviews = await Review.find(filter)
      .populate({
        path: "user",
        select:
          "-__v -password -updatedAt -_id -passwordResetToken -passwordResetExpires -createdAt -role -address -phonenum -email",
      })
      .populate({path:"item",select:"-__v -reviews -description -image -stock -createdAt"}).select("-__v -updatedAt");
    if (reviews.length == 0)
      return next(new AppError("Reviews Are empty ", 404));
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.createReview = async (req, res, next) => {
  try {
    if (!req.body.item) req.body.item = req.params.itemid;

    if (!req.body.user) req.body.user = req.user.id;
    const newreview = await Review.create(req.body);
    res.status(201).json({
      status: "success",
      data: newreview,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
exports.updateReview = controlfactory.updateOne(Review);
exports.deleteReview = controlfactory.deleteOne(Review);
