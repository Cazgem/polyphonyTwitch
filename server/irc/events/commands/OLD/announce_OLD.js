const config = require('../../../config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const fs = require('fs');
const mysql = require('mysql');
const polyphony = require('../../polyphony');

exports.run = (client, msg, params, context, channel, self) => {
    if (context.mod || (context["display-name"] === "gamesinasnap")) {
        let sql = `SELECT name FROM CiaS_Participants`;
        let response = db.query(sql, (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (id) {
                client.action(result[id].name, msg.slice(9));
            });
        });
    } else {
        client.action(channel, `You aren't authorized to use this command!`);
    }
}