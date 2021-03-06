const express = require('express');
const request = require('request');
const app = express();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let logs = [];


app.use(express.json());

app.get('/', (req, res) => {
  res.send('webhook is running.');
});

app.get('/logs', (req, res) => {
  res.send(logs);
});

app.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);      
    }
  }
});

app.post('/webhook', (req, res) => {  
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach( entry => {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      logs.push(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid); 
      logs.push(sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }

});

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
  let response;

  if (received_message.text) {
    response = {
      "text": `Azt küldted, hogy: "${received_message.text}". Most küldj egy képet!`,
    };
  } else if (received_message.attachments) {
    let attachment_url = received_message.attachments[0].payload.url;
    logs.push(`attachment URL: ${attachment_url}`);
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Ezt a képet akartad?",
            "subtitle": "Válaszolj a gombokkal.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Igen!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "Nem!",
                "payload": "no",
              }
            ],
          }],
        },
      },
    }
  }

  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {
  let response;

  let payload = received_postback.payload;

  if (payload === 'yes') {
    response = {"text": "Köszi!"};
  } else if (payload === 'no') {
    response = {"text": "Upsz, akkor küldj egy másikat!"};
  }

  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  let request_body = {
    "messaging_type": "RESPONSE",
    "recipient": {
      "id": sender_psid,
    },
    "message": response,
  }; 

  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
      logs.push('message sent!');
      logs.push(response);
      logs.push(body);
    } else {
      console.error("Unable to send message:" + err);
      logs.push(`nemjó: ${err}`);
    }
  }); 
  
}

module.exports = app;
