const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");
const userSchema = require("../schemas/userModel");

const fs = require("fs");
const path = require("path");

const bloodRequestSchema = require("../schemas/bloodRequest");
const bedRequestSchema = require("../schemas/bedRequest");
const bedSchema = require("../schemas/bedModel");
const medicineSchema = require("../schemas/medicineModel");
const allotMedicineSchema = require("../schemas/allotMedicine");

const updateDoctorProfileController = async (req, res) => {
  console.log(req.body);
  try {
    const doctor = await docSchema.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    await doctor.save();
    return res.status(200).send({
      success: true,
      data: doctor,
      message: "successfully updated profile",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docSchema.findOne({ userId: req.body.userId });

    const allApointments = await appointmentSchema.find({
      doctorId: doctor._id,
    });

    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: allApointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const handleStatusController = async (req, res) => {
  try {
    const { userid, appointmentId, status } = req.body;

    const appointment = await appointmentSchema.findOneAndUpdate(
      { _id: appointmentId }, 
      { status: status }, 
      { new: true } 
    );

    const user = await userSchema.findOne({ _id: userid });

    const notification = user.notification;

    notification.push({
      type: "status-updated",
      message: `your appointment get ${status}`,
    });

    await user.save();
    await appointment.save();

    return res.status(200).send({
      success: true,
      message: "successfully updated",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const documentDownloadController = async (req, res) => {
  const appointId = req.query.appointId;
  try {
    const appointment = await appointmentSchema.findById(appointId);

    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    // Assuming that the document URL is stored in the "document" field of the appointment
    const documentUrl = appointment.document?.path; // Use optional chaining to safely access the property

    if (!documentUrl || typeof documentUrl !== "string") {
      return res
        .status(404)
        .send({ message: "Document URL is invalid", success: false });
    }

    // Construct the absolute file path
    const absoluteFilePath = path.join(__dirname, "..", documentUrl);

    // Check if the file exists before initiating the download
    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res
          .status(404)
          .send({ message: "File not found", success: false, error: err });
      }

      // Set appropriate headers for the download response
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(absoluteFilePath)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      // Stream the file data to the response
      const fileStream = fs.createReadStream(absoluteFilePath);
      fileStream.on("error", (error) => {
        console.log(error);
        return res.status(500).send({
          message: "Error reading the document",
          success: false,
          error: error,
        });
      });
      // Pipe the fileStream to the response
      fileStream.pipe(res);

      // Send the response after the file stream ends (file download is completed)
      fileStream.on("end", () => {
        res.end();
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

const allotmentBloodController = async (req, res) => {
  const { bloodDetails, status, userId } = req.body;
  try {
    const bloodRequest = new bloodRequestSchema({
      ...bloodDetails,
      PatientId: bloodDetails.patientId,
      DocId: userId,
      price: bloodDetails.price,
    });

    const userBloodRequest = await userSchema.findById({ _id: userId });

    const patient = await userSchema.findOne({ _id: bloodDetails.patientId });
    const notification = patient.notification;
    notification.push({
      message: `${userBloodRequest.fullName} has alloted for blood ${bloodDetails.bloodType}. Now go for payment`,
      data: {
        fullName: userBloodRequest.fullName,
      },
    });

    await bloodRequest.save();
    await userSchema.findByIdAndUpdate(patient._id, { notification });

    return res.status(201).send({
      success: true,
      message: "Blood allotment sent successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while applying", success: false, error });
  }
};

const getAllBloodAllotmentController = async (req, res) => {
  const { userId } = req.body;
  try {
    const bloodRequest = await bloodRequestSchema.find({ DocId: userId });
    return res.status(201).send({
      success: true,
      data: bloodRequest,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while applying", success: false, error });
  }
};

const allotmentBedController = async (req, res) => {
  const { bedDetails, userId } = req.body;

  const bed = await bedSchema.findById({ _id: bedDetails.bedId });
  try {
    const bedRequest = new bedRequestSchema({
      ...bedDetails,
      DocId: userId,
      price: bed.price,
    });

    const userBedRequest = await userSchema.findById({ _id: userId });

    const patient = await userSchema.findOne({ _id: bedDetails.patientId });
    const notification = patient.notification;
    notification.push({
      message: `${userBedRequest.fullName} has alloted for bed ${bedDetails.bedType}. Now go for payment`,
      data: {
        fullName: userBedRequest.fullName,
      },
    });
    await bedRequest.save();
    await userSchema.findByIdAndUpdate(patient._id, { notification });

    return res.status(201).send({
      success: true,
      message: "Bed request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while applying", success: false, error });
  }
};

const getAllBedAllotmentController = async (req, res) => {
  const { userId } = req.body;
  try {
    const bedRequest = await bedRequestSchema.find({ DocId: userId });
    return res.status(201).send({
      success: true,
      data: bedRequest,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while applying", success: false, error });
  }
};

const handleDischargeController = async (req, res) => {
  const { requestid } = req.params;
  const { status } = req.body;
  try {
    const patient = await bedRequestSchema.findByIdAndUpdate(
      {
        _id: requestid,
      },
      {
        status,
      },
      { new: true }
    );

    const bedCount = await bedSchema.findByIdAndUpdate(
      {
        _id: patient.bedId,
      },
      { $inc: { quantity: +1 } },
      { new: true }
    );

    const user = await userSchema.findOne({ _id: patient.patientId });
    const notification = user.notification;
    notification.push({
      message: `you have been ${status}`,
      data: {
        fullName: user.patientName,
      },
    });
    await userSchema.findByIdAndUpdate(user._id, { notification });
    return res.status(201).send({
      success: true,
      message: `the patient has been ${status}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while applying", success: false, error });
  }
};

const getAllMedicinesController = async (req, res) => {
  try {
    const allMedicines = await medicineSchema.find();
    return res.status(200).send({
      success: true,
      data: allMedicines,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while fetching", success: false, error });
  }
};

const postMedicinesController = async (req, res) => {
  try {
    const prescription = req.body;
    const medicinesData = req.body.medicines;
    const patient = await userSchema.findById({ _id: req.body.patientId });

    // Loop through the medicines in the request
    for (const medicineData of medicinesData) {
      const { medicineId, dose } = medicineData;

      const updatedMedicine = await medicineSchema.findByIdAndUpdate(
        medicineId,
        { $inc: { medicineQuantity: -parseInt(dose) } },
        { new: true } // This ensures that you get the updated document
      );

      if (!updatedMedicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine with ID ${medicineId} not found.`,
        });
      }
    }

    const notification = patient.notification;
    notification.push({
      fullName: patient.patientName,
      message: `You have been given a Medicine by the Doctor`,
    });

    prescription.docId = req.body.userId;
    const prescriptionData = new allotMedicineSchema(prescription);

    await prescriptionData.save();

    await userSchema.findByIdAndUpdate(patient._id, { notification });

    return res.status(200).send({
      success: true,
      message: "Prescription added successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error while fetching", success: false, error });
  }
};

const getAllMedicineController = async (req, res) => {
  const { userId } = req.body;
  try {
    const allPrecription = await allotMedicineSchema.find({ docId: userId });
    return res.status(201).send({
      success: true,
      data: allPrecription,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error while fetching", success: false, error });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
  allotmentBloodController,
  allotmentBedController,
  getAllBloodAllotmentController,
  getAllBedAllotmentController,
  handleDischargeController,
  getAllMedicinesController,
  postMedicinesController,
  getAllMedicineController,
};
