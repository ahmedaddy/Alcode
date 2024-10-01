const express = require("express");
const accountCreationLimiter = require("../utils/rateLimiter");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  register,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  getLoggedUserData,
  getUser,
} = require("../controllers/authcontroller");

const router = express.Router();

const authcontroller = require("../controllers/authcontroller");

router.route("/register").post(signupValidator, register);
router.route("/login").post(loginValidator, login);

// router.use(authcontroller.protect, authcontroller.allowedTo("admin"));

router.route("/getMe").get(authcontroller.protect, getLoggedUserData, getUser);

router.use(accountCreationLimiter);

router.route("/forgotPassword").post(accountCreationLimiter, forgotPassword);
router
  .route("/verifyResetCode")
  .post(accountCreationLimiter, verifyPassResetCode);
router.route("/resetPassword").put(accountCreationLimiter, resetPassword);

module.exports = router;
