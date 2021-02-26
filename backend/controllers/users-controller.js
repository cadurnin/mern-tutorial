const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { validateResult } = require("./shared");

let DUMMY_USER = [
  {
    name: "John Smith",
    email: "test@test.com",
    uid: "u1",
    password: "test123",
  },
  {
    name: "Fred Smith",
    email: "test2@test.com",
    uid: "u2",
    password: "test123",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ message: DUMMY_USER });
};

const signUp = (req, res, next) => {
  validationResult(req, res, next);
  const checkExisting = DUMMY_USER.find((d) => d.email === email);

  if (checkExisting) {
    return next(new HttpError("User already exists", 404));
  }

  const newUser = {
    uid: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USER = [...DUMMY_USER, newUser];

  res.status(201).json({ message: newUser });
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
