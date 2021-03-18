const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Bearer token
    if (!token) {
      console.log('Could not find token')
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, config["secret"]);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
};
