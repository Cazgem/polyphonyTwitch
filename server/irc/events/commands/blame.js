const config = require('../../config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const fs = require('fs');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, self) => {
    if (params[0]) {
        client.action(channel, context["display-name"] + ' has blamed ' + params[0] + '. Who do you blame?');
    } else {
        client.action(channel, `Time for the blame game!`);
    }
}