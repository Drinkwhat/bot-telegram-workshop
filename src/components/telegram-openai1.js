const { Configuration, OpenAIApi } = require("openai");
const { join } = require("path")
require("dotenv").config({ 
    path: join(__dirname, "../../.env") 
})
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const scelteCalde = []
const scelteFredde = []
const scelteMiti = []
module.exports = {
    chooseByTemperature : async (type) => {
        let message = `consigliami un posto ` + type + 
        ` in cui andare in vacanza, voglio solo il nome della città e la città non deve essere nell'array scelte `

        if (type == 'caldo') {
            message += scelteCalde
        } else if (type == 'freddo') {
            message += scelteFredde
        } else if (type == 'mite') {
            message += scelteMiti
        }
        
        let maxLimit = 0

        let choice = ''
        do {
            if (maxLimit === 5){
                return 'non ho trovato città'
            }
            maxLimit++

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                temperature: 0.2,
                messages: [{"role": "user", "content": message}],
                max_tokens: 200
            })
            choice = completion.data.choices[0].message.content
            
        } while ( scelteFredde.includes(choice) || scelteCalde.includes(choice) || scelteMiti.includes(choice) || choice === '');
        if (type == 'caldo') {
            scelteCalde.push(choice)
        } else if (type == 'freddo') {
            scelteFredde.push(choice)
        } else if (type == 'mite') {
            scelteMiti.push(choice)
        }

        return choice     
    }
}
