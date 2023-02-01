import express  from "express"
import bodyParser  from "body-parser";
import { PORT }  from "./confing.js"
import request from "request";
const API_KEY = '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';
const MODEL_ENGINE = 'text-davinci-003';

const app = express().use(bodyParser.json());
 
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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

app.get('/', (req, res) => {
    res.status(200).send({message : 'Hello to my chatbot'});
})

//Handle messages events
function handleMessage(sender_psid, received_message){
    let response;

    
async function generateText(prompt) {
  try {
    const response = await fetch(`https://api.openai.com/v1/engines/${MODEL_ENGINE}/completions`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.5
      })
    });
    const data = await response.json();
    return data.choices[0].text;
  } catch (error) {
    console.error(error);
  }
}

// Usage
const prompt = received_message.text;

    if(received_message.text){
        response = {
            "text": generateText(prompt).then(output => output)
        };
    }

    callSendApi(sender_psid, response);
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


