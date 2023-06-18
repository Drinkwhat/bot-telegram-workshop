const { Configuration, OpenAIApi } = require("openai");
const { join } = require("path")
require("dotenv").config({ 
    path: join(__dirname, "../../.env") 
})
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


module.exports = {
    getInfo : async (place) => {
        
        let message = `mi trovo a ${place} quali sono 3 peculiarità di questo luogo?`
        let completion = ""
        completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0.2,
            messages: [{"role": "user", "content": message}],
            max_tokens: 400
        })
        return completion.data.choices[0].message.content
    }
}