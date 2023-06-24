// telegram
const { Telegraf, Markup } = require("telegraf")
const  { tempChoice }  = require("./components/buttons")


// openai
const { chooseByTemperature, chooseByRange, getInfo } = require("./components/openAI-request")

// APIs request
const { getDistance } = require("./components/distance")
const { getNews } = require("./components/news")
const { getWeather } = require("./components/weather")

const trad = require("./components/traslations.json")
const { join } = require("path")
require("dotenv").config({
  path: join(__dirname, "../.env")
})

let lastCity = false

const stripMessage = str => str.replace(/\/\S+\s/, "")

const {
  BOT_TOKEN
} = process.env


if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN must be provided!")
}

const bot = new Telegraf(BOT_TOKEN)

bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))


bot.start((ctx) => {
  ctx.reply("Hello World!")
})

// dice all'utente che ha inviato la posizione la distanza dalla l'ultima città proposta

bot.command("distance",  async(ctx) => {
  await ctx.reply(
    "invia la tua posizione",
    Markup.keyboard([
      Markup.button.locationRequest("Send location")
    ]).resize()
  )
})

bot.on("location", async(ctx) => {
  try {
    const departureCity = ctx.message.location
    getDistance(departureCity, lastCity).then((res) => {
      ctx.reply(`la distanza da ${lastCity} è ${res.toFixed(1).toString()} km`)
    })
  } catch {
    ctx.reply("devi scegliere prima la città")
  }
})

// dice all'utente la descrizione della città proposta
bot.command("news", (ctx) => {
  if (lastCity) {
    getNews(lastCity).then((news) => {
      ctx.reply(news)
    })
  } else {
    ctx.reply("non ti ho ancora proposto nessuna città")
  }
})

// dice all'utente il meteo della città proposta
bot.command("weather", (ctx) => {
  if (lastCity) {
    getWeather(lastCity).then((weather) => {
      let wh = weather.weather
      wh = (trad[wh]) ? trad[wh] : weather.weather
      ctx.reply(`A ${lastCity} ci sono ${weather.temp}°C con un umidità di ${weather.humidity}% e il clima è ${wh}`)
    })
  } else {
    ctx.reply("non ti ho ancora proposto nessuna città")
  }
})

// select by temperature
bot.command("slT", (ctx) => {
  ctx.reply("Quale temperatura preferisci per la tua vacanza", tempChoice.inline())
})


bot.on("callback_query", (ctx) => {
  ctx.answerCbQuery()
  chooseByTemperature(ctx.callbackQuery.data).then((res) => {
    ctx.reply(res)
    lastCity = res
  })
})

// select by range
bot.command("slR", (ctx) => {
  try {
    let text = stripMessage(ctx.message.text)
    text = text.split("-")
    if (text.length !== 2) {
      ctx.reply("errore, il messaggio deve seguire il formato: /slR nomeCittà-distanza in km")
    } else {
      chooseByRange([text[0], text[1]]).then((res) => {
        lastCity = res
        ctx.reply("Una località che ti consiglio nel range di distanza che mi hai indicato è " + res)
      })
    }
  } catch (error) {
    ctx.reply("errore" + error)
  }
})

bot.command("info", (ctx) => {
  ctx.reply("sto scrivendo...")
  if (lastCity) {
    getInfo(lastCity).then((news) => {
      ctx.reply(news)
    })
  } else {
    ctx.reply("non ti ho ancora proposto nessuna città")
  }
})