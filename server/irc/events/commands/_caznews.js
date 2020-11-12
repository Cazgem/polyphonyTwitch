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

function caznews() {
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
                item: 'Cazgem News',
                visible: true
            })
            setTimeout(() => {
                obs.send('SetSceneItemProperties', {
                    item: 'Cazgem News',
                    visible: false
                })
            }, 120000);
        })
        .catch(err => { // Promise convention dicates you have a catch on every chain.
            console.log(err);
        });
}
exports.run = (client, msg, params, context, channel, self) => {
    if (channel.slice(1) !== 'cazgem') {
        return;
    } else {
        polyfunc = params[0];
        let msg2 = msg.slice(9);
        if (msg2) {
            if ((context['user-type'] === ('mod')) || (context["display-name"] === "Cazgem")) {
                let post = {
                    title: 'Post',
                    body: msg2
                };
                let sql = 'INSERT INTO caznews SET ?';
                let query = db.query(sql, post, (err, result) => {
                    if (err) throw err;
                    console.log("New Headline submitted by " + context['display-name'] + ": " + msg2);
                });
            } else {
                client.action(channel, "Try submitting a headline via the channel points system");
                return;
            }
        }
        caznews();
    }
}