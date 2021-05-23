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
    // client.action(channel, context["display-name"] + ` has voted for ${params[0]} which brings the total to `);
    // var chan = channel.slice(1);
    // let sql = `UPDATE votes SET vote = ${} WHERE channel = "gamesinasnap" AND name = "vote" AND user = "${context["display-name"]}"`;
    // let query = db.query(sql, (err, result) => {
    //     if (err) throw err;
    // });
    // let sqlfetch = 'SELECT count FROM counters WHERE id="1"';
    // let count = db.query(sqlfetch, (err, result) => {
    //     if (err) throw err;
    //     Object.keys(result).forEach(function (key) {
    //         var row = result[key];
    //         let count = row.count;
    //         client.action(channel, `Caz's derp has known no bounds ${count} times since 3rd October 2019. KAPOW Poooound`);
    //     });
    // });
    // polyphony.OBS_trigger('Derp!', 2000);
}