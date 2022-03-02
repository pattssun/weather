const express = require("express");
const app = express();
const https = require('https');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) { // catch post request from HTML form

  const query = req.body.cityName; // user input
  const apiKey  = "caf0374a3430d8990a6f30ce341a7588";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  // fetch data from external server
  https.get(url, function(response) {
    console.log(response.statusCode); // status of HTTP request

    response.on("data", function(data) { // return data
      const weatherData = JSON.parse(data); // convert to JS object
      const temp = weatherData.main.temp; // get temp dat
      const weatherDescription =  weatherData.weather[0].description; // get description data
      const icon = weatherData.weather[0].icon; // get icon data
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; // fetch icon image

      // send data back to client
      res.write("<p>The weather is currently " + weatherDescription + ".</p>");
      res.write("<h1>The temperature in " + query +  " is " + temp + " degrees Celsius.</h1>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
