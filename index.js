//VAriables messenger
import express  from "express"
import bodyParser  from "body-parser";
import { PORT }  from "./confing.js"
import request from "request";
import axios from 'axios';


//llaves de chat GPT
const API_KEY = process.env.API_KEY;
const MODEL_ENGINE = 'text-davinci-003';

//Variables servidor
const app = express().use(bodyParser.json());
 
//variable token de messenger
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get('/', (req, res) => {
    res.status(200).send({message : 'Hello to my chatbot'});
})


//Configuracion Webhook
app.post('/webhook', (req, res) => {
    console.log('POST: webhook',)

    const body = req.body;
    if(body.object === 'page'){

        body.entry.forEach( entry => {
            //Se reciben y procesan los mensajes
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);

            const sender_psid = webhookEvent.sender.id;

            console.log(`Sender PSID: ${sender_psid}`);

            //Validar que estamos recibiendo un mensaje
            if(webhookEvent.message){
                handleMessage(sender_psid, webhookEvent.message);
            }else if(webhookEvent.postback){
                handlePostback(sender_psid, webhookEvent.postback)
            }
        });

        res.status(200).send('Event recived')

    }else{
        return res.status(404).send({message : "page not found"});
    }
});

app.get('/webhook', (req, res) => {
    console.log('GET: webhook',)

    const VERIFY_TOKEN = 'TokenUnico';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge']

    if(mode && token){
        if(mode === 'subscribe' && token === VERIFY_TOKEN){
            console.log('WebHook verificado');
            res.status(200).send(challenge);
        }else{
            return res.status(404).send({message : "page not found"});
        }
    }else{
        return res.status(404).send({message : "page not found"});
    }

});

//Handle messages events
function handleMessage(sender_psid, received_message){
    let response;

    async function generateText(prompt) {
        try {
        const response = await axios({
        method: 'post',
        url: `https://api.openai.com/v1/engines/${MODEL_ENGINE}/completions`,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
        },
        data: {
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.5
        }
        });
        return response.data.choices[0].text;
        } catch (error) {
        console.error(error);
        }
        }
        
        // Usage
        const prompt = received_message.text;
        
    if(received_message.text){
        response = {
            "text": `SIUUUUUU ${received_message.text}`
        };
    }

    setTimeout(()=>{
        console.log(response);
    }, 3000)
    
}

//Handle messaging_postbkacks events
function handlePostback(sender_psid, recived_postback){

}

function callSendApi(sender_psid, response){
    const requestBody = {
        "recipient": {
            "id": sender_psid   
        },
        "message": response
    };

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": requestBody
    }, (err, res, body)=>{
        if(!err){
            console.log("Mensaje enviado de vuelo");
        }else{
            console.error("Imposible enviar mensaje :(")
        }
    });
}

app.listen(PORT, () =>{
    console.log('listening on port ', PORT);
})


