const mongoose = require("mongoose");
const crypto = require("crypto");
const Item = require('./../models/Item')

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }, { quantity: Number ,default: 1 }],
  totalAmount: Number,
  orderid:{
    type:String,
  },

  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled","deactivated"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});



OrderSchema.pre("save", async function (next) {
  const order = this;
  order.orderid=crypto.randomBytes(4).toString("hex").toUpperCase()
  const items = order.items;
    let totalAmount = 0;
    items.forEach((item) => {
        totalAmount += item.price * item.quantity;

    });
    order.totalAmount = totalAmount;
    next();
});

OrderSchema.pre("save", async function (next) {
  try {
      for (const item of this.items) {
          const product = await Item.findById(item._id);
          if (!product) {
              return next(new Error(`Product with ID ${item._id} not found`));
          }

          if (product.stock < item.quantity) {
              return next(new Error(`Not enough stock for ${product.name}`));
          }

          await Item.findByIdAndUpdate(item._id, {
              stock: product.stock - item.quantity,
          });
      }
      next();
  } catch (error) {
      next(error);
  }
});








module.exports = mongoose.model("Order", OrderSchema);
