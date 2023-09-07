const mongoose = require("mongoose");

const medicineModel = mongoose.Schema({
  medicineName: {
    type: String,
    required: [true, "Medicine Name is required"],
  },
  organizationName: {
    type: String,
    required: [true, "Organization Name is required"],
  },
  medicineQuantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
});

const medicineSchema = mongoose.model("medicine", medicineModel);

module.exports = medicineSchema;
