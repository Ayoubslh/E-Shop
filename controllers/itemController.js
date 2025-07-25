const controlfactory = require('./../utils/handlerFactory');
const mongoose = require('mongoose');
const Item =  require('./../models/Item');
const AppError = require('./../utils/appError');
const Review = require('./../models/Review');
const apiFeatures = require('./../utils/apiFeatures');
const {uploadImage} = require('./../utils/cloudinaryUpload');


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

exports.createItem = async (req, res, next) => {
    try {
        let imageUrl;
        if (req.file) {
            const result = await uploadImage(req.file.buffer, {
                folder: 'items'
            });
            imageUrl = result.secure_url;
        }

        if (imageUrl) {
            req.body.image = imageUrl;
        }

        const item = await Item.create(req.body);

        await item.populate('reviews');

        res.status(201).json({
            status: 'success',
            data: {
                item
            }
        });
    } catch (err) {
        next(new AppError(err.message, 400));
    }
}


exports.getItem = controlfactory.getOne(Item,'reviews');
exports.updateItem = controlfactory.updateOne(Item);
exports.deleteItem = controlfactory.deleteOne(Item);