'use strict';

const routes = require('./app/routes');
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Handles messages events
const handleMessage = (sender_psid, received_message) => {

}

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {

}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  
}

routes.listen(PORT, () => {
  console.log(`webhook is listening 🔥`);
});
