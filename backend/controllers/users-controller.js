// const User = require("../models/user");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { validateResult } = require("./shared");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../../config");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const error = validationResult(req, res, next);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { name, email, password } = req.body;
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

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  const createdUser = User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed", 500);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      config["secret"],
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Creating user failed", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ user: createdUser.id, email: createdUser.email, token: token });
};

const userLogin = async (req, res, next) => {
  validationResult(req);

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials could not log you in",
      401
    );
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials could not log you in",
      403
    );
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      config["secret"],
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Login failed", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ user: existingUser.id, email: existingUser.email, token: token });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.userLogin = userLogin;
