const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  specs: {
    body: {
      dimensions: { type: String, required: true },
      weight: { type: String, required: true },
      build: { type: String, required: true },
      sim: { type: String, required: true },
    },
    display: {
      type: { type: String, required: true },
      size: { type: String, required: true },
      resolution: { type: String, required: true },
    },
    platform: {
      os: { type: String, required: true },
      chipset: { type: String, required: true },
      cpu: { type: String, required: true },
      gpu: { type: String, required: true },
    },
    memory: {
      internal: { type: String, required: true },
      cardSlot: { type: String, required: true },
    },
    mainCamera: {
      triple: { type: String },
      quad: { type: String },
      dual: { type: String },
      features: { type: String, required: true },
      video: { type: String, required: true },
    },
    selfieCamera: {
      single: { type: String, required: true },
      features: { type: String, required: true },
      video: { type: String, required: true },
    },
    battery: {
      type: { type: String, required: true },
      charging: { type: String, required: true },
    },
    features: {
      sensors: { type: String, required: true },
      audio: { type: String, required: true },
    },
    connectivity: {
      wlan: { type: String, required: true },
      bluetooth: { type: String, required: true },
      gps: { type: String, required: true },
      nfc: { type: String, required: true },
      usb: { type: String, required: true },
    },
  },
  stock: { type: Number, required: true, min: 0 },
  averageRatings: { type: Number, default: 0 },
  ratingQuantity: { type: Number, default: 0 },
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
module.exports = Item