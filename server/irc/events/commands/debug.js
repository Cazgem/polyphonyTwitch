const config = require('../../config');
// const OBSWebSocket = require('obs-websocket-js');
// const obs = new OBSWebSocket();
// const fs = require('fs');
const mysql = require('mysql');
const db = mysql.createPool({
    connectionLimit: 10,
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, self, polyphony) => {
    if (context['display-name'] === 'Cazgem') {
        if ((context.mod) || (context['user-id'] === context['room-id'])) {
            const moderator = true;
        } else {
            console.log(`meh`)
        }
    }
}