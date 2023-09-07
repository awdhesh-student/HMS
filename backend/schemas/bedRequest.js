const mongoose = require("mongoose");

const bedRequestModel = mongoose.Schema({
  DocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "beds",
  },
  bedType: {
    type: String,
    required: [true, "Bed Type is required"],
  },
  patientName: {
    type: String,
    required: [true, "Patient Name Required"],
  },
  Payment: {
    type: String,
    default: 'unpaid'
  },
},{
  strict: false
});

const bedRequestSchema = mongoose.model("bed-request", bedRequestModel);

module.exports = bedRequestSchema;
