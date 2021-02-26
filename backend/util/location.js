const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "00000";

function getCoordsForAddress(address) {
  return { lat: 40.7484474, lng: -73.98715 };

  /*
    The paid version
    const response = await axios.get(`http://www.test.com/api/test/${encodeURIComponent()}`)

    const data = response.data

    if(!data || data.status === 'ZERO_RESULTS) {
        const error = new HttpError('Test', 422);
        throw error;
    }
    const coordinates = data.results[0].geometry.location;

    

  */
}

module.exports = getCoordsForAddress;
