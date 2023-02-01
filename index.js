import express  from "express"
import bodyParser  from "body-parser";
import { PORT }  from "./confing.js"

const app = express().use(bodyParser.json());
 
app.post('/webhook', (req, res) => {
    console.log('POST: webhook',)

    const body = req.body;
    if(body.object === 'page'){

        body.entry.forEach( entry => {
            //Se reciben y procesan los mensajes
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
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
app.listen(PORT, () =>{
    console.log('listening on port ', PORT);
})