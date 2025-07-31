const mongoose = require("mongoose");
const crypto = require("crypto");
const Item = require("./../models/Item");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],

  totalAmount: { type: Number, min: 0, default: 0 },

  orderid: {
    type: String,
    unique: true,
    required: true, 
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },

  deliveryDate: { type: Date, required: true },

  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled", "deactivated"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

// Generate Order ID
OrderSchema.pre("validate", function (next) {
  if (!this.orderid) {
    this.orderid = crypto.randomBytes(4).toString("hex").toUpperCase();
  }
  next();
});

// Calculate totalAmount
OrderSchema.pre("save", async function (next) {
  try {
    let totalAmount = 0;

    for (const item of this.items) {
      const product = await Item.findById(item.product);
      if (!product) return next(new Error(`Product with ID ${item.product} not found`));

      if (product.stock < item.quantity) {
        return next(new Error(`Not enough stock for ${product.name}`));
      }

      totalAmount += product.price * item.quantity;

      // Decrease stock
      await Item.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    this.totalAmount = totalAmount;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Order", OrderSchema);
