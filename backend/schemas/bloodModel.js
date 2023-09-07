const mongoose = require("mongoose");

const bloodModel = mongoose.Schema({
  bloodType: {
    type: String,
    required: [true, "Blood Type is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
});

const bloodSchema = mongoose.model("blood", bloodModel);

module.exports = bloodSchema;
