const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { validateResult } = require("./shared");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user", 404)
    );
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((u) => {
    return u.creator === userId;
  });
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user", 404)
    );
  }

  res.json(places);
};

var DUMMY_PLACES = [
  {
    id: "p1",
    title: "Chrysler Building",
    description: "A very cool building",
    location: {
      lat: 40.75214096386921,
      lng: -73.97524450793833,
    },
    address: "405 Lexington Ave, New York, NY 10174",
    creator: "u1",
  },
];

const createPlace = async (req, res, next) => {
  validateResult(req);

  const { title, description, address, creator } = req.body;

  const coordinates = getCoordsForAddress(address);

  const createdPlace = Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b6/Caspar_David_Friedrich_044.jpg",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  validateResult(req);
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
