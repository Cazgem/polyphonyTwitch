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
    console.log(`I'm here!`)
    if (context['display-name'] === 'Cazgem') {
        count = 0;
        config.modules.superModerators.forEach(channel_name => {
            console.log(`I'm here!`)
            // polyphony.user(channel_name, function (err, data) {
            //     count = count + 1;
            //     console.log(`${count}: ${data.login} | ${data.id}`)
            //     let module = 'superModerator';
            //     let load = {
            //         channel_name: data.login,
            //         channel_id: data.id
            //     }
            //     let sql0 = `INSERT IGNORE INTO channels (channel,channel_ID) VALUES (?,?)`;
            //     db.query(sql0, [load.channel, load.channel_id], (err, result) => {
            //         if (err) throw err;
            //     });
            //     let sql = `UPDATE channels SET ${module}="1", channel=? WHERE channel_ID=?`;
            //     db.query(sql, [load.channel_name, load.channel_id], (err, result) => {
            //         if (err) throw err;
            //     });
            // })
        });
    }
}