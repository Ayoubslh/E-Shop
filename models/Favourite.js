const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }]
});

module.exports = mongoose.model("Favourite", FavouriteSchema);