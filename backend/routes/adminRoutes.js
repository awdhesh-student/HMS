const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
  addBloodController,
  getBloodController,
  deleteBloodController,
  updateBloodController,
  getAllBloodRequestAdminController,
  addBedController,
  getAllBedController,
  deleteBedController,
  updateBedController,
  getAllBedRequestAdminController,
  addMedicineController,
  allMedicinesController,
  updateMedicineController,
  deleteMedicineController,
} = require("../controllers/adminC");

const router = express.Router();

router.get("/getallusers", authMiddleware, getAllUsersControllers);

router.get("/getalldoctors", authMiddleware, getAllDoctorsControllers);

router.post("/getapprove", authMiddleware, getStatusApproveController);

router.post("/getreject", authMiddleware, getStatusRejectController);

router.get('/getallAppointmentsAdmin', authMiddleware, displayAllAppointmentController)

router.post('/addblood', authMiddleware, addBloodController)

router.get('/allblood', authMiddleware, getBloodController)

router.delete('/deleteblood/:bloodid', authMiddleware, deleteBloodController)

router.put('/updateblood/:bloodid', authMiddleware, updateBloodController)

router.get('/getbloodrequest',authMiddleware, getAllBloodRequestAdminController)

router.post('/addbed', authMiddleware, addBedController)

router.get('/allbed', authMiddleware, getAllBedController)

router.delete('/deletebed/:bedid', authMiddleware, deleteBedController)

router.put('/updatebed/:bedid', authMiddleware, updateBedController)

router.get('/getbedrequest', authMiddleware, getAllBedRequestAdminController)

router.post('/addMedicine', authMiddleware, addMedicineController)

router.get('/allMedicines', authMiddleware, allMedicinesController)

router.put('/updateMedicine/:medicineid', authMiddleware, updateMedicineController)

router.delete('/deletemedicine/:medicineid', authMiddleware, deleteMedicineController)

module.exports = router;
