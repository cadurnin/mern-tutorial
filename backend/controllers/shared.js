const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const validateResult = (req) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError("Invalid input passed, check your data", 422);
    }
  };

exports.validateResult = validateResult;