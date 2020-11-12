const config = require('../../config');
const polyphony = require(`polyphony.js`);
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

function caznews() {
    polyphony.OBS_trigger('Cities News', 120000);
}
exports.run = (client, msg, params, context, channel, self) => {
    polyfunc = params[0];
    params[0] = '';
    if (msg) {
        if ((context['user-type'] === ('mod')) || (context["display-name"] === "Cazgem")) {
            let post = {
                title: 'Post',
                body: msg2
            };
            let sql = 'INSERT INTO citiesnews SET ?';
            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                console.log("New Headline submitted by " + context['display-name'] + ": " + msg);
            });
        } else {
            return;
        }
    }
    caznews();
}