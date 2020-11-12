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
    client.action(channel, `TwitchUnity bleedPurple TwitchUnity bleedPurple TwitchUnity imGlitch ${params[0]} imGlitch Thank you for the sub, it is greatly appreciated imGlitch bleedPurple TwitchUnity bleedPurple TwitchUnity bleedPurple`);
}