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

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
const irc = require('./server/irc');
// const polyphony = require(`./polyphony`);
irc.start(app, path);