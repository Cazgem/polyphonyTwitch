const config = require('../../config');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, polyphony) => {
    if (channel.slice(1) === `z_lycos`) {
        console.log(`death.js run for ${channel}`)
        if (!msg) {
            let sql = `UPDATE counters SET count = count + 1 WHERE channel = "${channel.slice(1)}" AND name = "death"`;
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            let sqlfetch = `SELECT count FROM counters WHERE channel = "${channel.slice(1)}" AND name = "death"`;
            let count = db.query(sqlfetch, (err, result) => {
                if (err) throw err;
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    let count = row.count;
                    client.action(channel, `Lycos has died ${count} times since 23rd September 2020. KAPOW Poooound`);
                });
            });
        } else if (msg === 'total') {
            let sqlfetch = `SELECT count FROM counters WHERE channel = "${channel.slice(1)}" AND name = "death"`;
            let count = db.query(sqlfetch, (err, result) => {
                if (err) throw err;
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    let count = row.count;
                    client.action(channel, `Lycos has died ${count} times since 23rd September 2020. KAPOW Poooound`);
                });
            });
        } else {
            client.action(channel, `Try "!death total" to see how many he's racked up.`);
        }
    }
}