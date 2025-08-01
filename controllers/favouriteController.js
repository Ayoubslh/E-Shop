const Favourite = require("../models/Favourite");   
const Item = require("../models/Item");

exports.getFavourites = async (req, res, next) => {
    try {
        const favourites = await Favourite.findOne({ user: req.user.id })
            .populate({
                path: "items",
                populate: {
                    path: "product",
                    select: "name brand image price"
                }
            })
            
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

        const itemId = req.body.itemId;
        if (!itemId) return next(new AppError("Item ID is required", 400));

        // Check if the item exists
        const item = await Item.findById(itemId);
        if (!item) return next(new AppError(`Item with ID ${itemId} not found`, 404));

        // Find or create user's favourites
        let favourites = await Favourite.findOne({ user: userId });
        if (!favourites) {
            favourites = await Favourite.create({
                user: userId,
                items: []
            });
        }

        // Add item to favourites if not already present
        if (!favourites.items.includes(itemId)) {
            favourites.items.push(itemId);
            await favourites.save();
        }

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