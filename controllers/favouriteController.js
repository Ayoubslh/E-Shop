const Favourite = require("../models/Favourite");   
const Item = require("../models/Item");
const AppError = require('./../utils/appError');

exports.getFavourites = async (req, res, next) => {
    try {
        const favourites = await Favourite.findOne({ user: req.user.id })
            .populate({
                path: "items",
                select: "name brand image price"
            });

        if (!favourites) return next(new AppError('No favourites found', 404));
        res.status(200).json({
            status: 'success',
            data: {
                favourites
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
};

exports.addToFavourites = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        if (!userId) return next(new AppError("You are not authorized", 403));

        const itemIds = req.body.items;
        if (!itemIds || !Array.isArray(itemIds)) {
            return next(new AppError("Item IDDs are required", 400));
        }

        // Check if the item exists
        const items = await Item.find({ _id: { $in: itemIds } });
        if (!items || items.length === 0) {
            return next(new AppError(`Items not found`, 404));
        }

        // Find or create user's favourites
        let favourites = await Favourite.findOne({ user: userId });
        if (!favourites) {
            favourites = await Favourite.create({
                user: userId,
                items: []
            });
        }

        // Add item to favourites if not already present
        items.forEach(async (item) => {
            if (!favourites.items.includes(item._id)) {
                favourites.items.push(item._id);
            }
        });
        await favourites.save();

        res.status(200).json({
            status: "success",
            data: {
                favourites
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}
exports.removeFromFavourites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) return next(new AppError("You are not authorized", 403));

        const itemId = req.body.itemId;
        if (!itemId) return next(new AppError("Item ID is required", 400));

        // Find user's favourites
        const favourites = await Favourite.findOne({ user: userId });
        if (!favourites) return next(new AppError('No favourites found', 404));

        // Remove item from favourites
        favourites.items = favourites.items.filter(item => item.toString() !== itemId);
        await favourites.save();

        res.status(200).json({
            status: "success",
            data: {
                favourites
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}