

const mongoose = require("mongoose");
const Item =require('./../models/Item')

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { type: String, trim: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Prevent a user from reviewing the same item multiple times
ReviewSchema.index({ user: 1, item: 1 }, { unique: true });
ReviewSchema.statics.calcAverageRatings=async function(itemid){
   const stats= await this.aggregate([
        {
            $match:{item:itemid}
        },
        {
            $group:{
                _id:'$item',
                nRating:{$sum:1},
                avrRating:{$avg :'$rating'}
            }
        }
    ])
    if(stats.lengh==0){
        await Item.findByIdAndUpdate(itemid,{
            averageRatings:0,
            ratingQuantity:0
        
           })

    }

   await Item.findByIdAndUpdate(itemid,{
    averageRatings:stats[0].avrRating,
    ratingQuantity:stats[0].nRating

   })
}

ReviewSchema.post('save',function(){
    Review.calcAverageRatings(this.item)
})

ReviewSchema.pre(/^findOneAnd/,async function(next){
    this.rev=await this.findOne()
    next()
})

ReviewSchema.post(/^findOneAnd/,async function(){
    Review.calcAverageRatings(this.rev.tour)
})

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
