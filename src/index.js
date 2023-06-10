//        EASTER EGG WORD: XALDO


const { Telegraf, Markup } = require("telegraf")
const { join } = require("path")
const { Configuration, OpenAIApi } = require("openai")

const  buttons  = require("./components/buttons")

const { chooseByTemperature } = require("./components/telegram-openai1")
const { chooseByRange } = require("./components/telegram-openai2")
const { Key } = require("telegram-keyboard")

const { getDistance } = require("./components/distance")
const { getnews } = require("./components/news")
const { getweather } = require("./components/weather")
let lastcity = false

require("dotenv").config({
  path: join(__dirname, "../.env")
})

const {
  BOT_TOKEN,
  OPENAI_API_KEY
} = process.env

console.log(BOT_TOKEN)

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

    getDistance(departureCity, lastcity).then((res) => {
    ctx.reply(res.toString())
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
    'Special buttons keyboard',
    Markup.keyboard([
      Markup.button.locationRequest('Send location')
    ]).resize()
  )
})
  /* if (lastcity){
    getDistance(ctx.message.location, lastcity).then((dist) => {
      ctx.reply(dist)
    })
  } else {
      ctx.reply("non ti ho ancora proposto nessuna città")
    }
  }) */

bot.command("news", (ctx) => {
  if (lastcity){
    getNews(lastcity).then((news) => {
      ctx.reply(news)
    })
  } else {
      ctx.reply("non ti ho ancora proposto nessuna città")
    }
  })
  
bot.command("weather", (ctx) => {
  if (lastcity){
    getWeather(lastcity).then((weather) => {
      ctx.reply(weather)
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
        lastcity=res
      })
      console.log("caldo")
      break
    case "temp-r2":
      chooseByTemperature("mite").then((res) => {
        ctx.reply(res)
        lastcity=res
      })
      console.log("mite")
      break
    case "temp-r3":
      chooseByTemperature("freddo").then((res) => {
        ctx.reply(res)
        lastcity=res
      })
      console.log("freddo")
      break
    default:
      ctx.reply("opzione disabile")
  }
})


// bot.command("slR", (ctx) => {
//     ctx.reply("Keyboard test", buttons.rangeChoice.inline())});


/** ************************************************************************************************ */
bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

/* write here */


// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))