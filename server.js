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
  let URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city_name}&key=${process.env.WEATHERBIT_API_KEY}&lon=${lon}&lat=${lat}`;
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

let handleMovieData = async (req, res) => {
  let searchQuery = req.query.searchQuery;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
  let response = await axios.get(url);
  let movieData = response.data;

  let filterdData = movieData.results.map((value) => {
    return new ForecastMovie(
      value.title,
      value.overview,
      value.vote_average,
      value.vote_count,
      value.poster_path,
      value.popularity,
      value.release_date
    );
  });
  res.status(200).send(filterdData);
};

class ForecastMovie {
  constructor(
    title,
    overview,
    vote_average,
    vote_count,
    poster_path,
    popularity,
    release_date
  ) {
    this.title = title;
    this.overview = overview;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
    this.poster_path = `https://image.tmdb.org/t/p/w500/${poster_path}`;
    this.popularity = popularity;
    this.release_date = release_date;
  }
}
console.log(ForecastMovie.poster_path);

app.get(`/movies`, handleMovieData);
