require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const chatBotController = {
  getHomePage: async (req, res) => {
    res.send("Hello homePage");
  },

  getWebhook: async (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  },

  postWebhook: async (req, res) => {
    let body = req.body;

    if (body.object === "page") {
      body.entry.forEach(function (entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);
      });

      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  },
};

module.exports = chatBotController;
