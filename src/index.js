//        EASTER EGG WORD: XALDO


const { Telegraf, Markup } = require("telegraf")
const { join } = require("path")
const { Configuration, OpenAIApi } = require("openai")

const  buttons  = require("./components/buttons")

const { chooseByTemperature } = require("./components/telegram-openai1")
const { chooseByRange } = require("./components/telegram-openai2")
const { Key } = require("telegram-keyboard")

const { getDistance } = require("./components/distance")
const { getNews } = require("./components/news")
const { getWeather } = require("./components/weather")
const { getInfo } = require("./components/info-request-openai")
let lastCity = false

const trad = require("./components/traduzioni.json")

require("dotenv").config({
  path: join(__dirname, "../.env")
})

const stripMessage = str => str.replace(/\/\S+\s/, "")

const {
  BOT_TOKEN,
  OPENAI_API_KEY
} = process.env


if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN must be provided!")
}

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY must be provided!")
}

const bot = new Telegraf(BOT_TOKEN)

const configuration = new Configuration({ apiKey: OPENAI_API_KEY })
const openAI = new OpenAIApi(configuration)


bot.start((ctx) => {
  ctx.reply("Hello World!")
})

bot.command("tik", (ctx) => {
  ctx.reply("tok")
})

bot.on("location", ctx => {
  try {
    const departureCity = ctx.message.location 

    getDistance(departureCity, lastCity).then((res) => {
    ctx.reply(`la distanza da ${lastCity} è ${res.toFixed(1).toString()} km`)
    })
  } catch {
    ctx.reply("devi scegliere prima la città")
  }
})

/** ************************************************************************************************
 botte\bot-telegram-workshop\src
*/

bot.command("distance",  async(ctx) => {
  await ctx.reply(
    'invia la tua posizione',
    Markup.keyboard([
      Markup.button.locationRequest('Send location')
    ]).resize()
  )
})


bot.command("news", (ctx) => {
  if (lastCity){
    getNews(lastCity).then((news) => {
      ctx.reply(news)
    })
  } else {
    ctx.reply("non ti ho ancora proposto nessuna città")
  }
})
  
bot.command("weather", (ctx) => {
  if (lastCity){
    getWeather(lastCity).then((weather) => {
      let wh = weather.weather
      console.log(trad[wh])
      wh = (trad[wh]) ? trad[wh] : weather.weather
      ctx.reply(`A ${lastCity} ci sono ${weather.temp}°C con un umidità di ${weather.humidity}% e il clima è ${wh}`)
    })
  } else {
      ctx.reply("non ti ho ancora proposto nessuna città")
    }
})



bot.command("slT", (ctx) => {
  // ctx.reply("tok")
  ctx.reply("Quale temperatura preferisci per la tua vacanza", buttons.tempChoice.inline())
})


bot.on("callback_query", (ctx) => {
  ctx.answerCbQuery()
  switch (ctx.callbackQuery.data) {
    case "temp-r1":
      chooseByTemperature("caldo").then((res) => {
        ctx.reply(res)
        lastCity=res
      })
      console.log("caldo")
      break
    case "temp-r2":
      chooseByTemperature("mite").then((res) => {
        ctx.reply(res)
        lastCity=res
      })
      console.log("mite")
      break
    case "temp-r3":
      chooseByTemperature("freddo").then((res) => {
        ctx.reply(res)
        lastCity=res
      })
      console.log("freddo")
      break
    default:
      ctx.reply("opzione disabile")
  }
})


bot.command("slR", (ctx) => {
  try {
    let text = stripMessage(ctx.message.text)
    text = text.split("-")
    if (text.length != 2) {
      ctx.reply("errore, il messaggio deve seguire il formato: /slR nomeCittà-distanza")
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
  if (lastCity){
    getInfo(lastCity).then((news) => {
      ctx.reply(news)
    })
  } else {
    ctx.reply("non ti ho ancora proposto nessuna città")
  }
})


/** ************************************************************************************************ */
bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

/* write here */

