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
exports.run = (client, msg, params, context, channel, polyphony) => {
    if (channel.slice(1) === `cazgem`) {
        let sql = 'UPDATE counters SET count = count + 1 WHERE channel = "cazgem" AND name = "cazderp"';
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
        });
        let sqlfetch = 'SELECT count FROM counters WHERE id="1"';
        let count = db.query(sqlfetch, (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
                var row = result[key];
                let count = row.count;
                client.action(channel, `Caz's derp has known no bounds ${count} times since 3rd October 2019. KAPOW Poooound`);
            });
        });
        polyphony.OBS.trigger('Derp!', 2, function (err, res) {
            if (err) { console.log(err) }
        })
    }
}