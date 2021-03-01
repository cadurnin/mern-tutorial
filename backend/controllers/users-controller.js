// const User = require("../models/user");
const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { validateResult } = require("./shared");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  res.status(200).json({ message: DUMMY_USER });
};

const signUp = async (req, res, next) => {
  const error = validationResult(req, res, next);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { name, email, password, places } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists", 422);
    return next(error);
  }

  const createdUser = User({
    name,
    email,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b9/Canberra_%28AU%29%2C_Commonwealth_Avenue_Bridge_--_2019_--_1811.jpg",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const userLogin = (req, res, next) => {
  validationResult(req);

  const { email, password } = req.body;

  let lookup = DUMMY_USER.find((u) => u.email === email);

  if (!lookup || password != lookup.password) {
    return next(new HttpError("No user found or password is wrong", 401));
  }

  res.status(200).json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.userLogin = userLogin;
