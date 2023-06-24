const axios = require("axios")
const Debug = require("debug")
const { join } = require("path")
require("dotenv").config({
  path: join(__dirname, "../../.env")
})

const debug = Debug("news")
Debug.enable("*")

const instance = axios.create({
  baseURL: "https://newsapi.org/v2/top-headlines",
  params: {
    apiKey: process.env.NEWS_API_KEY,
    from: "2023-05-10",
    sort: "popularity",
    language: "it"
  }
})

const getNews = async(location) => {
  const res = await instance.get("", {
    params: {
      q: location
    }
  })
  debug(res.data)
  return res.data
}

module.exports = {
  getNews
}