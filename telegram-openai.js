const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "YOUR_API_KEY",
});
const openai = new OpenAIApi(configuration);



const send = async (type) => {

    let message = "consigliami una  città " + type + " in cui andare in vacanza voglio solo il nome della città"

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        temperature: 1,
        prompt: message,
        max_tokens: 200
    });
    return completion.data.choices[0].text
}

send(choice).then((res) => {
    console.log(res)
})


