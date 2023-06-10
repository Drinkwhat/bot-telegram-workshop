const axios = require("axios")
const Debug = require("debug")

const debug = Debug("distance")
Debug.enable("*")


const instance = axios.create({
  baseURL: "https://nominatim.openstreetmap.org/",
  params: {
    format: "json",
    limit: 1
  }
})

const getCoordinates = async(location) => {
  location = location.split(",")
  const res = await instance.get("/", {
    params: {
      city: location[0]
    }
  })
  debug("Coordinates: %O", res.data)
  return {
    latitude: res.data[0].lat,
    longitude: res.data[0].lon
  }
}

const getDistance = async(departureCity, arrivalCity) => {
  // Raggio medio della Terra in chilometri
  const r = 6371
  const coordinates = await getCoordinates(arrivalCity.toLowerCase().split(" ").join("%"))

  // Conversione delle latitudini e longitudini in radianti
  const lat1_rad = toRadians(departureCity.latitude)
  const lon1_rad = toRadians(departureCity.longitude)
  const lat2_rad = toRadians(coordinates.latitude)
  const lon2_rad = toRadians(coordinates.longitude)

  // Differenze tra le latitudini e longitudini
  const delta_lat = lat2_rad - lat1_rad
  const delta_lon = lon2_rad - lon1_rad

  // Calcolo della distanza utilizzando la formula dell'averseno
  const a =
    Math.sin(delta_lat / 2) ** 2 +
    Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(delta_lon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = r * c

  debug(`Distance between ${departureCity} and ${arrivalCity} is ${distance} km`)
  return distance
}

const toRadians = degrees => {
  return (degrees * Math.PI) / 180
}

module.exports = {
  getCoordinates,
  getDistance
}