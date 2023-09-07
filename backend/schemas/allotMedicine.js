const mongoose = require("mongoose");

const allotMedicineModel = mongoose.Schema({
  docId: {
    type: String,
    required: [true, "Doc Id is required"],
  },
  patientId: {
    type: String,
    required: [true, "Patient Id is required"],
  },
  patientName: {
    type: String,
    required: [true, "Patient Name is required"],
  },
  symptoms: {
    type: String,
    required: [true, "Symptoms is required"],
  },
  medicines: {
    type: Array,
  },
});

const allotMedicineSchema = mongoose.model("allotMedicine", allotMedicineModel);

module.exports = allotMedicineSchema;
