/**
 * Required External Modules
 */
const hb = require(`./heartbeat2.js`);
const config = require('./server/irc/config.js');
const express = require('express');
const https = require(`https`);
const chalk = require('chalk');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require("body-parser");
const router = require('./server/routes');
const path = require("path");
// const notifier = require(`node-notifier`);
const http = require(`http`);
const socketIo = require(`socket.io`);
const Polyphony = require('polyphony.js');
const polyphony = new Polyphony(config, 3207);
const webpush = require(`web-push`);
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
/**
 * App Variables
 */
const publicVapidKey = config.publicVapidKey;
const privateVapidKey = config.privateVapidKey;
webpush.setVapidDetails(`mailto:notifications@polyphony.me`, publicVapidKey, privateVapidKey);
const app = express();
// const port = process.env.PORT || "443";
const port = "3000";
https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(port);

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * Routes Definitions
 */
app.use(express.static(path.join(__dirname, `client`)));
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
    // notifier.notify('Go empty the dishwasher!');
});
app.get("/user", (req, res) => {
    res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});
app.get("/webhook/*", (req, res) => {
    console.log(req.body) // Call your action on the request here
    res.status(200).end() // Responding is important
})
app.post("/charity", (req, res) => {
    console.log(req.body) // Call your action on the request here
    res.status(200).end() // Responding is important
})
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
// middleware
app.use(morgan('dev'));

//listen and respond to heartbeat request from parent
process.on('message', (message) => {
    if (message && message.request === 'heartbeat') {
        process.send({
            heartbeat: 'thump'
        });
    }
});

app.use(express.static('browser/public'));

// app.use('/', router);

// app.use(bodyParser.json());

app.post("/hook", (req, res) => {
    console.log(req.body) // Call your action on the request here
    res.status(200).end() // Responding is important
})
app.listen(port, () => {
    console.log(chalk.yellow(`App is listening at https://twitchapi.polyphony.me/`));
});
const irc = require('./server/irc');
// const polyphony = require(`./polyphony`);
// irc.start();