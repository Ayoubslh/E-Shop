const multer = require('multer');
const path = require('path');
const AppError = require('./appError');


const multerStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 30 * 1024 * 1024 
        
    }
});

module.exports = upload;
