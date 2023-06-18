const { Configuration, OpenAIApi } = require("openai")
const { join } = require("path")
require("dotenv").config({
  path: join(__dirname, "../../.env")
})
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const scelte = []

const chooseByRange = async(arr) => {
  const message = "mi trovo a " + arr[0] + " consigliami una  città  a " + arr[1] + ` km in cui andare in vacanza, 
        voglio solamente il nome della città, la città non deve essere nell'array` + scelte
  let completion = ""
  let maxLimit = 0
  do {
    if (maxLimit === 5) {
      return "non ho trovato città"
    }
    maxLimit++

    completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      messages: [{ role: "user", content: message }],
      max_tokens: 200
    })
  } while (scelte.includes(completion.data.choices[0].message.content) || completion.data.choices[0].message.content === "")

  scelte.push(completion.data.choices[0].message.content)
  return completion.data.choices[0].message.content
}

const getInfo = async(place) => {

  const message = `mi trovo a ${place} quali sono 3 peculiarità di questo luogo?`
  let completion = ""
  completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    messages: [{ role: "user", content: message }],
    max_tokens: 400
  })
  return completion.data.choices[0].message.content
}

const scelteCalde = []
const scelteFredde = []
const scelteMiti = []

const chooseByTemperature = async(type) => {
  let message = "consigliami un posto " + type +
      " in cui andare in vacanza, voglio solo il nome della città e la città non deve essere nell'array scelte "

  if (type === "caldo") {
    message += scelteCalde
  } else if (type === "freddo") {
    message += scelteFredde
  } else if (type === "mite") {
    message += scelteMiti
  }

  let maxLimit = 0

  let choice = ""
  do {
    if (maxLimit === 5) {
      return "non ho trovato città"
    }
    maxLimit++

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      messages: [{ role: "user", content: message }],
      max_tokens: 200
    })
    choice = completion.data.choices[0].message.content

  } while (scelteFredde.includes(choice) || scelteCalde.includes(choice) || scelteMiti.includes(choice) || choice === "")
  if (type === "caldo") {
    scelteCalde.push(choice)
  } else if (type === "freddo") {
    scelteFredde.push(choice)
  } else if (type === "mite") {
    scelteMiti.push(choice)
  }

  return choice
}

module.exports = {
  chooseByRange,
  getInfo,
  chooseByTemperature
}