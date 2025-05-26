const controlfactory = require('./../utils/handlerFactory');
const Item= require('./../models/Item');
const AppError = require('./../utils/appError');
const Review = require('./../models/Review');
const apiFeatures = require('./../utils/apiFeatures');


exports.getAllItems = async (req, res) => {
    try {
        const features = new apiFeatures(Item.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const items = await features.query;
        res.status(200).json({
            status: 'success',
            results: items.length,
            data: {
                items
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}




exports.createItem = controlfactory.create(Item);
exports.getItem = controlfactory.getOne(Item,'reviews');
exports.updateItem = controlfactory.updateOne(Item);
exports.deleteItem = controlfactory.deleteOne(Item);