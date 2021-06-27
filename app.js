/**
 * Required External Modules
 */
var fs = require('fs');
const config = require('./server/irc/config.js');
const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require("body-parser");
const router = require('./server/routes');
const path = require("path");
// const notifier = require(`node-notifier`);
const http = require(`http`);
const https = require(`https`);
const socketIo = require(`socket.io`);
const Polyphony = require('polyphony.js');
const polyphony = new Polyphony(config, 3207);
const webpush = require(`web-push`);
const crypto = require('crypto');
const _config = JSON.parse(fs.readFileSync(path.join(
  __dirname,
  '_config.json'
)));
const credentials = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
const app = express();

/**
 * App Variables
 */
// const port = process.env.PORT || "443";
const port = "3000";

/**
 *  App Configuration
 */
app.set("view engine", "pug");
/**
 *  Middleware
 */
// app.use('/', router);
// app.use(express.static('browser/public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, `views`)));
app.use(bodyParser.json({
  verify: function (req, res, buf, encoding) {
    // is there a hub to verify against
    req.twitch_hub = false;
    if (req.headers && req.headers.hasOwnProperty('twitch-eventsub-message-signature')) {
      req.twitch_hub = true;
    }
  }
}));
// app.use(bodyParser.json());

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
  console.log("/home?")
  // notifier.notify('Go empty the dishwasher!');
});
app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
  console.log("/user?")
});
app.post("/charity", (req, res) => {
  console.log(req.body) // Call your action on the request here
  res.status(200).end() // Responding is important
});
app.post('/massban', function (req, res) {
  const tmi = require('tmi.js');
  var channel_list = eval("[" + req.body.channels + "]");
  const clientz = new tmi.client({
    options: { debug: true },
    connection: {
      reconnect: true,
      secure: true
    },
    identity: {
      username: `${req.body.login}`,
      password: `oauth:${req.body.token}`
    },
    // channels: [`${req.body.channels}`] // <--- Problem
    channels: [`${req.body.login}`]
  });
  // res.send('Massbanned "' + req.query.name + '".');
  // console.log(`Massban Request: ${req.body.name} ${req.body.login} ${req.body.origin} ${req.body.token} ${channel_list}`)
  if (req.body.origin === config.secure_origin) {
    clientz.connect().catch(console.error);
    setTimeout(() => {
      polyphony.massban(clientz, req.body.name, channel_list)
    }, (2500));
    setTimeout(() => {
      clientz.disconnect()
    }, (30000));
    res.sendStatus(200);
  } else {
    console.log(`INVALID BAN REQUEST`);
    res.sendStatus(201);
  }
});
app.post('/massunban', function (req, res) {
  const tmi = require('tmi.js');
  var channel_list = eval("[" + req.body.channels + "]");
  const clientz = new tmi.client({
    options: { debug: true },
    connection: {
      reconnect: true,
      secure: true
    },
    identity: {
      username: `${req.body.login}`,
      password: `oauth:${req.body.token}`
    },
    // channels: [`${req.body.channels}`] // <--- Problem
    channels: [`${req.body.login}`]
  });
  // res.send('Massbanned "' + req.query.name + '".');
  // console.log(`Massban Request: ${req.body.name} ${req.body.login} ${req.body.origin} ${req.body.token} ${channel_list}`)
  if (req.body.origin === config.secure_origin) {
    clientz.connect().catch(console.error);
    setTimeout(() => {
      polyphony.massunban(clientz, req.body.name, channel_list)
    }, (2500));
    setTimeout(() => {
      clientz.disconnect()
    }, (30000));
    res.sendStatus(200);
  } else {
    console.log(`INVALID UNBAN REQUEST`);
    res.sendStatus(201);
  }
});
app.post(`/subscribe`, (req, res) => {
  const subscription = req.body;
  res.status(201).json({})
  const payload = JSON.stringify({ title: 'Push test' });
  webpush.sendNotification(subscription, payload).catch(err => console.error(err));
})
app.get('/report', function (req, res) {
  // res.send('You sent the name "' + req.query.name + '".');
  console.log(`Derp Activated! BLECK!`)
  polyphony.userReport(req.query.name, function (err, response) {
    res.send(response);
  })
});
/**
 * Server Activation
 */

//listen and respond to heartbeat request from parent
process.on('message', (message) => {
  if (message && message.request === 'heartbeat') {
    process.send({
      heartbeat: 'thump'
    });
  }
});

app.listen(port, () => {
  console.log(chalk.yellow(`App is listening at https://twitchapi.polyphony.me/`));
});
const twitchSigningSecret = 'cazcatsbestcats';
const verifyTwitchSignature = (req, res, buf, encoding) => {
  const messageId = req.header("Twitch-Eventsub-Message-Id");
  const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
  const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
  const time = Math.floor(new Date().getTime() / 1000);
  console.log(`Message ${messageId} Signature: `, messageSignature);

  if (Math.abs(time - timestamp) > 600) {
    // needs to be < 10 minutes
    console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
    throw new Error("Ignore this request.");
  }

  if (!twitchSigningSecret) {
    console.log(`Twitch signing secret is empty.`);
    throw new Error("Twitch signing secret is empty.");
  }

  const computedSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", twitchSigningSecret)
      .update(messageId + timestamp + buf)
      .digest("hex");
  console.log(`Message ${messageId} Computed Signature: `, computedSignature);

  if (messageSignature !== computedSignature) {
    throw new Error("Invalid signature.");
  } else {
    console.log("Verification successful");
  }
};

app.use(express.json({ verify: verifyTwitchSignature }));
app.post("/webhooks/callback", async (req, res) => {
  const messageType = req.header("Twitch-Eventsub-Message-Type");
  if (messageType === "webhook_callback_verification") {
    console.log("Verifying Webhook");
    return res.status(200).send(req.body.challenge);
  }
  const { type } = req.body.subscription;
  const { event } = req.body;

  console.log(
    `Receiving ${type} request for ${event.broadcaster_user_name}: `,
    event
  );

  res.status(200).end();
});
let clientId = config.clientId
let authToken = config.authToken
let ngrokUrl = 'twitchapi.polyphony.me'

app.post('/createWebhook/:broadcasterId', (req, res) => {
  var createWebHookParams = {
    host: "api.twitch.tv",
    path: "helix/eventsub/subscriptions",
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Client-ID": clientId,
      "Authorization": "Bearer " + authToken
    }
  }
  var createWebHookBody = {
    "type": "channel.follow",
    "version": "1",
    "condition": {
      "broadcaster_user_id": "470816908"
    },
    "transport": {
      "method": "webhook",
      // For testing purposes you can use an ngrok https tunnel as your callback URL
      "callback": ngrokUrl + "/notification", // If you change the /notification path make sure to also adjust in line 69
      "secret": "keepItSecretKeepItSafe" // Replace with your own secret
    }
  }
  var responseData = ""
  var webhookReq = https.request(createWebHookParams, (result) => {
    result.setEncoding('utf8')
    result.on('data', function (d) {
      responseData = responseData + d
    })
      .on('end', function (result) {
        var responseBody = JSON.parse(responseData)
        res.send(responseBody)
      })
  })
  webhookReq.on('error', (e) => { console.log("Error") })
  webhookReq.write(JSON.stringify(createWebHookBody))
  webhookReq.end()
})

function verifySignature(messageSignature, messageID, messageTimestamp, body) {
  let message = messageID + messageTimestamp + body
  let signature = crypto.createHmac('sha256', "keepItSecretKeepItSafe").update(message) // Remember to use the same secret set at creation
  let expectedSignatureHeader = "sha256=" + signature.digest("hex")

  return expectedSignatureHeader === messageSignature
}

app.post('/notification', (req, res) => {
  if (!verifySignature(req.header("Twitch-Eventsub-Message-Signature"),
    req.header("Twitch-Eventsub-Message-Id"),
    req.header("Twitch-Eventsub-Message-Timestamp"),
    req.rawBody)) {
    res.status(403).send("Forbidden") // Reject requests with invalid signatures
  } else {
    if (req.header("Twitch-Eventsub-Message-Type") === "webhook_callback_verification") {
      console.log(req.body.challenge)
      res.send(req.body.challenge) // Returning a 200 status with the received challenge to complete webhook creation flow

    } else if (req.header("Twitch-Eventsub-Message-Type") === "notification") {
      console.log(req.body.event) // Implement your own use case with the event data at this block
      res.send("") // Default .send is a 200 status
    }
  }
})
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
const irc = require('./server/irc');
// const polyphony = require(`./polyphony`);
irc.start(app, path);