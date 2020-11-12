const config = require('../../../config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const fs = require('fs');
const mysql = require('mysql');
const polyphony = require('../../polyphony');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, self) => {
    const modules_obs = [`cazgem`, `citiesinasnap`, `polyphony`];
    async function refresh(participant) {
        polyphony.OBS_RefreshParticipants(participant);
    }
    if ((modules_obs.includes(channel.slice(1)))) {
        if (params[0] === `all`) {
            refresh(1);
            refresh(2);
            refresh(3);
            refresh(4);
        } else {
            refresh(params[0]);
        }
    }
}