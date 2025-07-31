const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["phone", "smartwatch", "laptop",'tablet'],
    required: true,
  },
  specs: {
    body: {
      dimensions: { type: String },
      weight: { type: String },
      build: { type: String },
      sim: { type: String },
      waterResistant: { type: String }, // For smartwatch
    },
    display: {
      type: { type: String },
      size: { type: String },
      resolution: { type: String },
      refreshRate: { type: String }, // For laptops
      alwaysOn: { type: Boolean },    // For smartwatches
    },
    platform: {
      os: { type: String },
      chipset: { type: String },
      cpu: { type: String },
      gpu: { type: String },
    },
    memory: {
      internal: { type: String },
      cardSlot: { type: String },
      ram: { type: String },          // For laptops
      storageType: { type: String },  // SSD, HDD
    },
    mainCamera: {
      triple: { type: String },
      quad: { type: String },
      dual: { type: String },
      features: { type: String },
      video: { type: String },
    },
    selfieCamera: {
      single: { type: String },
      features: { type: String },
      video: { type: String },
    },
    battery: {
      type: { type: String },
      charging: { type: String },
      batteryLife: { type: String },  // For laptops/smartwatches
    },
    features: {
      sensors: { type: String },
      audio: { type: String },
    },
    connectivity: {
      wlan: { type: String },
      bluetooth: { type: String },
      gps: { type: String },
      nfc: { type: String },
      usb: { type: String },
    },
    ports: {
      usbC: { type: String },
      thunderbolt: { type: String },
      audioJack: { type: String },
      hdmi: { type: String },
      sdSlot: { type: String },
    },
    compatibility: {
      osSupport: { type: String },
      companionApp: { type: String },
    },
    keyboard: { type: String },   // For laptop
    trackpad: { type: String },   // For laptop
  },
  stock: { type: Number, required: true, min: 0 },
  averageRatings: { type: Number, default: 0 },
  ratingQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Virtuals for reviews and computed average rating
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
