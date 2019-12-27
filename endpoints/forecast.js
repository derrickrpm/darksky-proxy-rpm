const request = require("request-promise");

const API_URL = `https://api.darksky.net/forecast/${process.env.API_KEY}`;

exports.handler = (event, context, callback) => {
  const qs = event.queryStringParameters;
  const { lat, lon } = qs;
  if (!lat || !lon) {
    callback("You must provide a latitude and longitude");
    return;
  }

  const url = `${API_URL}/${lat},${lon}?exclude=currently,minutely,hourly,alerts,flags`;
  // Remove lat and lon parameters, they go in the URL
  delete qs.lat;
  delete qs.lon;

  const options = {
    qs,
    json: true
  };
  request(url, options)
    .then(response => {
      callback(null, {
        body: JSON.stringify(response),
        statusCode: 200,
        headers: getResponseHeaders(event)
      });
    })
    .catch(error => {
      callback(error);
    });
};
