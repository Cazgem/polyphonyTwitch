const config = require('../../../config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const fs = require('fs');
const mysql = require('mysql');
const polyphony = require('polyphony.js');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, self) => {


    function addParticipant(number, name) {
        console.log('Adding Participant');
        let sql = `UPDATE CiaS_Participants SET name = "${name}" WHERE number = "${number}"`;
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
        });
        console.log('Participant Added');
        console.log('Participant URL Identified');
        updateURL(number, name);
        console.log("Preparing to Refresh nameplates");
        polyphony.OBS_RefreshParticipants(number);
        client.action(channel, 'Edited Participant ' + number + ' information.');
        client.action(name, `Hey there, ${name}! I've been sent by CiaS staff to help things run smoothly for you during this event. In order to ensure I can do my job, I need to be granted moderator privileges for the duration of the event. Thanks, and good luck!`);
        console.log(channel, 'Edited Participant ' + number + ' information.');
    }

    function refreshParticipantNames(participant) {
        let source = `Participant Name ${participant}`;
        obs.connect({
            address: config.default.obs_address,
            password: config.default.obs_pass
        })
            .then(() => {
                console.log(`OBS Connection Established`);
            })
            .then(() => {
                obs.send('SetSceneItemProperties', {
                    item: source,
                    visible: false
                })
                setTimeout(() => {
                    obs.send('SetSceneItemProperties', {
                        item: source,
                        visible: true
                    })
                }, 1000);
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    }

    function updateURL(number, name) {
        try {
            obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
                .then(() => {
                    console.log(`OBS Connection Established`);
                })
                .then(() => {
                    return obs.send('SetBrowserSourceProperties', {
                        source: `Participant ${number} Screen`,
                        url: `https://player.twitch.tv/?channel=${name}&parent=streamernews.example.com&muted=true`
                    })
                })
                .catch(err => { // Promise convention dicates you have a catch on every chain.
                    console.log(err);
                });
        } catch (err) {
            console.log(`OBS Connection Failed to Establish`);
        }
        console.log(channel, 'Edited Participant ' + number + ' URL.');
    }

    if ((params[0] === 'edit') && ((context['user-type'] === ('mod')) || (context["display-name"] === "gamesinasnap"))) {
        addParticipant(params[1], params[2]);

    } else if ((params[0] === 'new') && ((context['user-type'] === ('mod')) || (context["display-name"] === "gamesinasnap"))) {
        addParticipant(1, params[1])
        setTimeout(() => {
            addParticipant(2, params[2]);
        }, 1000);
        setTimeout(() => {
            addParticipant(3, params[3]);
        }, 2000);
        setTimeout(() => {
            addParticipant(4, params[4]);
        }, 3000);
    } else if ((params[0] === 'join') && ((context['user-type'] === ('mod')) || (context["display-name"] === "gamesinasnap"))) {
        client.action(channel, "This round's Participants are: ");
        let sql = `SELECT * FROM CiaS_Participants`;
        let response = db.query(sql, (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (id) {
                client.join(result[id].name);
            });
        });
    } else if ((params[0] === 'part') && ((context['user-type'] === ('mod')) || (context["display-name"] === "gamesinasnap"))) {
        client.action(channel, "This round's Participants are: ");
        let sql = `SELECT * FROM CiaS_Participants`;
        let response = db.query(sql, (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (id) {
                client.part(result[id].name);
            });
        });
    } else {
        client.action(channel, "This round's Participants are: ");
        let sql = `SELECT * FROM CiaS_Participants`;
        let response = db.query(sql, (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (id) {
                client.action(channel, "Participant no. " + result[id].number + ": https://twitch.tv/" + result[id].name);
            });
        });
    }
}
// client.join(result[key].response);