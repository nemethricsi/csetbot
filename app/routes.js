const express = require('express');
const app = express();
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
      // logs.push(sender_psid);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }

});

module.exports = app;
