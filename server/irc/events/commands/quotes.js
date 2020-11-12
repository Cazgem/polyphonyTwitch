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

function cazsays() {
    obs.connect({
            address: config.default.obs_address,
            password: config.default.obs_pass
        })
        .then(() => {
            console.log(`OBS Connection Established`);
        })
        // .then(() => {
        //     return obs.send('GetsourceTypesList');
        // })
        .then(data => {
            obs.send('SetSceneItemProperties', {
                item: 'Cazgem Quotes',
                visible: true
            })
            setTimeout(() => {
                obs.send('SetSceneItemProperties', {
                    item: 'Cazgem Quotes',
                    visible: false
                })
            }, 120000);
        })
        .catch(err => { // Promise convention dicates you have a catch on every chain.
            console.log(err);
        });
}
exports.run = (client, msg, params, context, channel, self) => {
    if (params[0]) {
        if (Number.isInteger(params[0])) {
            let sql = `SELECT * FROM quotes WHERE channel = 1 AND id=?`;
            let query = db.query(sql, params[0], (err, result) => {
                if (result) {

                }
            })
            let sql = 'SELECT * FROM quotes ORDER BY RAND() LIMIT 1';
            let query = db.query(sql, (err, result) => {

            });
        }
    }
    client.action(channel, "Try submitting a headline via the channel points system");
    cazsays();
}