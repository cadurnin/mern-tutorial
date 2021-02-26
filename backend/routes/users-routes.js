const express = require("express");
const HttpError = require("../models/http-error");
const { check } = require("express-validator");

const userController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", userController.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 8 }),
    check("email").not().isEmpty(),
    check("email").isEmail()
  ],
  userController.signUp
);

router.post(
  "/login",
  [
    check("password").not().isEmpty(),
    check("email").not().isEmpty(),
    check("email").isEmail()
  ],
  userController.userLogin
);

module.exports = router;
