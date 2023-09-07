const mongoose = require("mongoose");

const bedModel = mongoose.Schema(
  {
    bedType: {
      type: String,
      required: [true, "Bed Type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
  },
  {
    strict: false,
  }
);

const bedSchema = mongoose.model("bed", bedModel);

module.exports = bedSchema;
