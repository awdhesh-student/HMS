const mongoose = require("mongoose");

const bloodRequestModel = mongoose.Schema({
  PatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  DocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  bloodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blood",
  },
  bloodType: {
    type: String,
    required: [true, "Blood Type is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  patientName: {
    type: String,
    required: [true, "Patient Name Required"],
  },
  price: {
    type: Number,
    default: 0
  },
  Payment: {
    type: String,
    default: "unpaid",
  },
});

const bloodRequestSchema = mongoose.model("blood-request", bloodRequestModel);

module.exports = bloodRequestSchema;
