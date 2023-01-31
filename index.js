const express = require('express')
const bodyParser = require('body-parser');

const app = express().use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('POST: webhook',)

    const body = req.body;
    if(body.object === 'page'){

        body.entry.forEcah( entry => {
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
    console.log('POST: webhook',)

    const VERIFY_TOKEN = 'TokenUnico';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const cahllenge = req.query['hub.cahllenge']

    if(mode && token){
        if(mode === 'subscribe' && token === VERIFY_TOKEN){
            console.log('WebHook verificado');
            res.status(200).send(cahllenge);
        }else{
            return res.status(404).send({message : "page not found"});
        }
    }else{
        return res.status(404).send({message : "page not found"});
    }

});

app.listen(3000, () =>{
    console.log('listening on port 3000');
})