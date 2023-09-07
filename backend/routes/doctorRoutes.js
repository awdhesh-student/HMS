const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
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
} = require("../controllers/doctorC");


const router = express.Router();

router.post("/updateprofile", authMiddleware, updateDoctorProfileController);

router.get(
  "/getdoctorappointments",
  authMiddleware,
  getAllDoctorAppointmentsController
);

router.post("/handlestatus", authMiddleware, handleStatusController);

router.get(
  "/getdocumentdownload",
  authMiddleware,
  documentDownloadController
);

router.post("/allotmentblood", authMiddleware, allotmentBloodController)

router.post('/allotmentbed', authMiddleware, allotmentBedController)

router.get("/getallbloodallotment", authMiddleware, getAllBloodAllotmentController)

router.get("/getallbedallotment", authMiddleware, getAllBedAllotmentController)

router.patch("/handledischarge/:requestid", authMiddleware, handleDischargeController)

router.get("/allmedicines", authMiddleware, getAllMedicinesController)

router.post("/postmedicine", authMiddleware, postMedicinesController)

router.get("/getallprecriptionallotment", authMiddleware, getAllMedicineController)

module.exports = router;
