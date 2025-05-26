const controlfactory = require('./../utils/handlerFactory');
const User = require('./../models/User');
const AppError = require('./../utils/appError');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) return next(new AppError('Users not found', 404));
        res.status(200).json({
            status: 'success',
            data: {
                name:users.name,
                email:users.email,
                address:users.address,
                phone:users.phone,

            }
        });
        } catch (err) {
            next(new AppError(err.message, 400));
        }
}


exports.createUser = controlfactory.create(User);


exports.getUser = async(req,res,next)=>{
    try {
        const doc=await User.findById(req.params.id);
        if(!doc){
            return next(new AppError('No document found with that ID',404));
        }
        res.status(200).json({
            status:'success',
            data:{
                name:doc.name,
                email:doc.email,
                address:doc.address,
                phone:doc.phone,

            }
        });
    } catch (error) {
        next( new AppError(error,500));
    }
}


exports.deleteUser = controlfactory.deleteOne(User);


exports.getMe=async(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}
 
exports.updateMe=async(req,res,next)=>{
    try {
        const doc=await User.findByIdAndUpdate(req.user.id,req.body,{
            new:true,
            runValidators:true
        });
        if(doc.password) return next(new AppError('This route is not for password updates',400));
        res.status(200).json({
            status:'success',
            data:{
                name:doc.name,
                email:doc.email,
                address:doc.address,
                phone:doc.phone,

            }
        });
    } catch (error) {
        next( new AppError(error,500));
    }
}

exports.deleteMe=async(req,res,next)=>{
    try {
        await User.findByIdAndUpdate(req.user.id,{active:false});
        res.status(204).json(null);
    } catch (error) {
        next( new AppError(error,500));
    }
}  


