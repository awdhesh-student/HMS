const docSchema = require("../schemas/docModel");
const userSchema = require("../schemas/userModel");
const appointmentSchema = require("../schemas/appointmentModel");
const bloodSchema = require("../schemas/bloodModel");
const bloodRequestSchema = require("../schemas/bloodRequest");
const bedSchema = require("../schemas/bedModel");
const bedRequestSchema = require("../schemas/bedRequest");
const medicineSchema = require("../schemas/medicineModel");
const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userSchema.find({});
    return res.status(200).send({
      message: "Users data list",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({});

    return res.status(200).send({
      message: "doctor Users data list",
      success: true,
      data: docUsers,
    });
  } catch (error) {
    console
      .log(error)
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    const doctor = await docSchema.findOneAndUpdate(
      { _id: doctorId },
      { status }
    );

    const user = await userSchema.findOne({ _id: userid });

    const notification = user.notification;
    notification.push({
      type: "doctor-account-approved",
      message: `Your Doctor account has ${status}`,
      onClickPath: "/notification",
    });

    user.isdoctor = status === "approved" ? true : false;
    await user.save();
    await doctor.save();

    return res.status(201).send({
      message: "Successfully update approve status of the doctor!",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    const doctor = await docSchema.findOneAndUpdate(
      { _id: doctorId },
      { status }
    );

    const user = await userSchema.findOne({ _id: userid });

    const notification = user.notification;
    notification.push({
      type: "doctor-account-approved",
      message: `Your Doctor account has ${status}`,
      onClickPath: "/notification",
    });

    await user.save();
    await doctor.save();

    return res.status(201).send({
      message: "Successfully updated Rejected status of the doctor!",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const displayAllAppointmentController = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find();
    return res.status(200).send({
      success: true,
      message: "successfully fetched All Appointments ",
      data: allAppointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const addBloodController = async (req, res) => {
  const { bloodType, quantity,price } = req.body;
  try {
    const bloodDetails = new bloodSchema({ bloodType, quantity, price });
    await bloodDetails.save();

    return res.status(201).send({
      message: "Successfully added blood",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getBloodController = async (req, res) => {
  try {
    const allBlood = await bloodSchema.find();

    return res.status(201).send({
      success: true,
      data: allBlood,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const deleteBloodController = async (req, res) => {
  const { bloodid } = req.params;
  try {
    const blood = await bloodSchema.findByIdAndDelete({ _id: bloodid });

    return res.status(201).send({
      message: "Successfully deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const updateBloodController = async (req, res) => {
  const { bloodid } = req.params;
  const { bloodType, quantity, price } = req.body;

  try {
    const blood = await bloodSchema.findByIdAndUpdate(
      { _id: bloodid },
      { bloodType, quantity, price },
      { new: true }
    );

    return res.status(201).send({
      message: "Blood details updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getAllBloodRequestAdminController = async (req, res) => {
  try {
    const allBloodRequest = await bloodRequestSchema.find();
    return res.status(200).send({
      success: true,
      data: allBloodRequest,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

// const getBloodStatusController = async (req, res) => {
//   const { requestid } = req.params;
//   const { docid, status } = req.body;
//   try {
//     const request = await bloodRequestSchema.findByIdAndUpdate(
//       { _id: requestid },
//       { status: req.body.status },
//       { new: true }
//     );

//     const blood = await bloodSchema.findById({ _id: request.bloodId });

//     const updatedBloodQuantity = blood.quantity - request.quantity;

//     const rest_of_blood = await bloodSchema.findByIdAndUpdate(
//       { _id: request.bloodId },
//       { quantity: updatedBloodQuantity },
//       { new: true }
//     );

//     const user = await userSchema.findOne({ _id: docid });

//     const notification = user.notification;
//     notification.push({
//       type: "granted-for-blood",
//       message: `Your Blood request has been ${status}`,
//     });

//     await userSchema.findByIdAndUpdate(user._id, { notification });

//     return res.status(201).send({
//       success: true,
//       message: `Blood request has been ${status}`,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .send({ message: "something went wrong", success: false });
//   }
// };

const addBedController = async (req, res) => {
  const { bedType, quantity, price } = req.body;
  try {
    const bedDetails = new bedSchema({ bedType, quantity, price });
    await bedDetails.save();

    return res.status(201).send({
      message: "Successfully addemedicine",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getAllBedController = async (req, res) => {
  try {
    const allBeds = await bedSchema.find();
    return res.status(200).send({
      success: true,
      data: allBeds,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const deleteBedController = async (req, res) => {
  const { bedid } = req.params;
  try {
    const bed = await bedSchema.findByIdAndDelete({ _id: bedid });

    return res.status(201).send({
      message: "Successfully deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const updateBedController = async (req, res) => {
  const { bedid } = req.params;
  const { bedType, quantity, price } = req.body;

  try {
    const bed = await bedSchema.findByIdAndUpdate(
      { _id: bedid },
      { bedType, quantity, price },
      { new: true }
    );

    return res.status(201).send({
      message: "Bed details updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getAllBedRequestAdminController = async (req, res) => {
  try {
    const allBedRequest = await bedRequestSchema.find();
    return res.status(200).send({
      success: true,
      data: allBedRequest,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

// const getBedStatusController = async (req, res) => {
//   const { requestid } = req.params;
//   const { status, docid } = req.body;

//   try {
//     const request = await bedRequestSchema.findByIdAndUpdate(
//       { _id: requestid },
//       {
//         status: req.body.status,
//       },
//       {
//         new: true,
//       }
//     );

//     const bed = await bedSchema.findOne({ _id: request.bedId });

//     const updatedBedQuantity = bed.quantity - 1;

//     const rest_of_bed = await bedSchema.findByIdAndUpdate(
//       { _id: request.bedId },
//       { quantity: updatedBedQuantity },
//       { new: true }
//     );

//     const user = await userSchema.findOne({ _id: docid });

//     const notification = user.notification;
//     notification.push({
//       type: "granted-for-bed",
//       message: `Your Bed request has been ${status}`,
//     });

//     await userSchema.findByIdAndUpdate(user._id, { notification });

//     return res.status(201).send({
//       success: true,
//       message: `Bed request has been ${status}`,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .send({ message: "something went wrong", success: false });
//   }
// };

const addMedicineController = async (req, res) => {
  try {
    const medicineDetails = new medicineSchema(req.body);
    await medicineDetails.save();

    return res.status(201).send({
      message: "Successfully added Medicine",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const allMedicinesController = async (req, res) => {
  try {
    const allMedicines = await medicineSchema.find();

    return res.status(201).send({
      success: true,
      data: allMedicines,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const updateMedicineController = async (req, res) => {
  const { medicineid } = req.params;

  try {
    const medicine = await medicineSchema.findByIdAndUpdate(
      { _id: medicineid },
      req.body,
      { new: true }
    );

    return res.status(201).send({
      message: "Medicine details updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const deleteMedicineController = async (req, res) => {
  const { medicineid } = req.params;
  try {
    const medicine = await medicineSchema.findByIdAndDelete({ _id: medicineid });

    return res.status(201).send({
      message: "Successfully deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};
module.exports = {
  getAllDoctorsControllers,
  getAllUsersControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
  addBloodController,
  getBloodController,
  deleteBloodController,
  updateBloodController,
  getAllBloodRequestAdminController,
  // getBloodStatusController,
  addBedController,
  getAllBedController,
  deleteBedController,
  updateBedController,
  getAllBedRequestAdminController,
  // getBedStatusController,
  addMedicineController,
  allMedicinesController,
  updateMedicineController,
  deleteMedicineController,
};
