const config = require('../../config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const fs = require('fs');
const mysql = require('mysql');
const polyphony = require(`polyphony.js`);
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, self) => {
    if (msg) {
        client.action(channel, `Here's your clout, ${msg}. Now get out! CLOUT CHASER!`);
    } else {
        client.action(channel, `Here's your clout, ` + context["display-name"] + `. Now get out! CLOUT CHASER!`);
    }
}