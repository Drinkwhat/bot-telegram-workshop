const axios = require("axios")
const Debug = require("debug")
const { join } = require("path")
const { getCoordinates } = require("./distance")
const { get } = require("http")

require("dotenv").config({
  path: join(__dirname, "../../.env")
})

const debug = Debug("weather")
Debug.enable("*")

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
      lat: coordinates.lat,
      lon: coordinates.lon
    }
  })
  debug(res.data)
  return res.data
}


module.exports = {
  getWeather
}