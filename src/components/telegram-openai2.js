const { Configuration, OpenAIApi } = require("openai");
const { join } = require("path")
require("dotenv").config({ 
    path: join(__dirname, "../.env") 
})
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
    chooseByRange : async (arr) => {
        
        let message = `mi trovo a ` + arr[0] + ` consigliami una  città  a ` + arr[1] + ` km in cui andare in vacanza, 
        voglio solo il nome della città, la città non deve essere nell'array scelte`

        const completition = await openai.createCompletion({
            model: "text-davinci-003",
            temperature: 0,
            prompt: message,
            max_tokens: 200
        });
        //scelte.push(completition.data.choices[0].text)
        return completition.data.choices[0].text
    }
}