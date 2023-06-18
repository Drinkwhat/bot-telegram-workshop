const axios = require("axios")
const { join } = require("path")
const { getCoordinates } = require("./distance")

require("dotenv").config({
  path: join(__dirname, "./../../.env")
})

const instance = axios.create({
  baseURL: "https://api.openweathermap.org/data/3.0/onecall",
  params: {
    exclude: "minutely,hourly,daily",
    units: "metric",
    lang: "it",
    appid: process.env.OPENWEATHERMAP_API_KEY
  }
})

const getWeather = async(location) => {
  const coordinates = await getCoordinates(location)
  const res = await instance.get("", {
    params: {
      lat: coordinates.latitude,
      lon: coordinates.longitude
    }
  })
  return {
    timezone_offset: res.data.timezone_offset,
    temp: res.data.current.temp,
    humidity: res.data.current.humidity,
    weather: res.data.current.weather[0].main
  }
}


module.exports = {
  getWeather
}