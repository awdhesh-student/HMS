const multer = require("multer");
const express = require("express");

const {
  registerController,
  loginController,
  authController,
  docController,
  deleteallnotificationController,
  getallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
  getAllBloodController,
  getAllBloodRequestController,
  getAllBedsController,
  handleBloodPaymentController,
  handleBedPaymentController,
  getAllBedRequestController,
  getAllPrecriptionController,
} = require("../controllers/userC");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix +"-"+ file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/getuserdata", authMiddleware, authController);

router.post("/registerdoc", authMiddleware, docController);

router.get("/getalldoctorsu", authMiddleware, getAllDoctorsControllers);

router.post("/getappointment",upload.single("image"), authMiddleware, appointmentController);

router.post(
  "/getallnotification",
  authMiddleware,
  getallnotificationController
);

router.post(
  "/deleteallnotification",
  authMiddleware,
  deleteallnotificationController
);

router.get("/getuserappointments", authMiddleware, getAllUserAppointments);

router.get("/getDocsforuser", authMiddleware, getDocsController)

router.get("/allblood", authMiddleware, getAllBloodController)

router.get("/getallbloodrequest", authMiddleware, getAllBloodRequestController)

router.get("/getallbedrequest", authMiddleware, getAllBedRequestController)

router.get('/allbed', authMiddleware, getAllBedsController)

router.patch('/handlebloodpayment/:requestid', authMiddleware, handleBloodPaymentController)

router.patch('/handlebedpayment/:requestid', authMiddleware, handleBedPaymentController)

router.get("/getallprecriptionallotment", authMiddleware, getAllPrecriptionController)


module.exports = router;
