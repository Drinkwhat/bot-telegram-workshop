const { Telegraf } = require("telegraf")
const { join } = require("path")
const { Configuration, OpenAIApi } = require("openai")

require("dotenv").config({
  path: join(__dirname, "../.env")
})

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

bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))