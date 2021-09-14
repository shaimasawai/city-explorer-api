"use strict";
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
app.use(cors());
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

let handleWeather = async (req, res) => {
  let lat = Number(req.query.lat);
  let lon = Number(req.query.lon);
  let city_name = req.query.city_name;
  let URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city_name}&key=${process.env.WEATHERBIT_API_KEY}`;
  let axiosResponse = await axios.get(URL);
  let weatherData = axiosResponse.data;
  let cleanedData = weatherData.data.map((item) => {
    return new ForeCast(item.datetime, item.weather.description);
  });
  res.status(200).json(cleanedData);
};

app.get("/weather", handleWeather);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});

class ForeCast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}
