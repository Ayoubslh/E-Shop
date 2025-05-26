const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },  // Fixed typo
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  averageRatings:{
    type:Number,
    default:0
  },
  ratingQuantity:{
    type:Number,
    default:0
  },
  shipping:{
    type:Boolean,
    required:true,

  },
  createdAt: { type: Date, default: Date.now },
});

ItemSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "item", 
});


ItemSchema.virtual("averageRating").get(function () {
  if (!this.populated("reviews") || !Array.isArray(this.reviews)) return 0;
  if (this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / this.reviews.length;
});




const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
