const AppError=require('./appError');

exports.create= Model=> async(req,res,next)=>{
    try {
        const doc=await Model.create(req.body);
        if(!doc){
            return next(new AppError('No document found with that ID',404));
        }
        res.status(201).json({
            status:'success',
            data:doc
        });
    } catch (error) {
        next( new AppError(error,500));
    }
}

exports.getAll= Model=> async(req,res,next)=>{
    try {
        const doc=await Model.find();
        if(!doc){
            return next(new AppError('No document found with that ID',404));
        }
        res.status(200).json({
            status:'success',
            results:doc.length,
            data:doc
            });
    }
    catch (error) {
        next( new AppError(error,500));
    }
}

exports.getOne= (Model,popOptions)=> async(req,res,next)=>{
    try {
        if(!req.params.id)req.params.id=req.user.id;
        const doc=await Model.findById(req.params.id).populate(popOptions);
        if(!doc){
            return next(new AppError('No document found with that ID',404));
        }
        res.status(200).json({

            status:'success',
            
            data:doc
            });
    }
    catch (error) {
        next( new AppError(error,500));
    }
}

exports.updateOne= Model=> async(req,res,next)=>{
    try {
        const doc=await Model.findByIdAndUpdate(req .params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!doc){
            return next(new AppError('No document found with that ID',404));
        }
        res.status(200).json({
            status:'success',
            data:doc
            });
    } catch (error) {
        next( new AppError(error,500));
    }
}

exports.deleteOne= Model=> async(req,res,next)=>{
    try {
        await Model.findByIdAndDelete(req.params.id);
        if(!doc){
            return next(new AppError('No document found with that ID',404));
        }
        res.status(204).json({
            status:'success',
            data:null
            });
    } catch (error) {
        next( new AppError(error,500));
    }
}


