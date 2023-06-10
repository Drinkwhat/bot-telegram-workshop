const { Configuration, OpenAIApi } = require("openai");
const { join } = require("path")
require("dotenv").config({ 
    path: join(__dirname, "../.env") 
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
        let message = `consigliami una  città ` + type + 
        ` in cui andare in vacanza voglio solo il nome della città e 
        voglio che non tieni conto di quelle inserite nell'array scelte `

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

            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                temperature: 0.3,
                prompt: message,
                max_tokens: 200
            })
            choice = completion.data.choices[0].text.replace('\n\n', '')
            console.log(choice)
        } while ( scelteFredde.includes(choice) || scelteCalde.includes(choice) || scelteMiti.includes(choice) || choice === '');
        if (type == 'caldo') {
            scelteCalde.push(choice)
            console.log(scelteCalde)
        } else if (type == 'freddo') {
            scelteFredde.push(choice)
            console.log(scelteFredde)
        } else if (type == 'mite') {
            scelteMiti.push(choice)
            console.log(scelteMiti)
        }

        return choice     
    }
}
