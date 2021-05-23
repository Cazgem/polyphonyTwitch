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
exports.run = (client, context, channel, db) => {
    if (context.mod || (context["display-name"] === "gamesinasnap")) {
        let sql = `SELECT name FROM CiaS_Participants`;
        let response = db.query(sql, (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (id) {
                try {
                    client.action(result[id].name, "cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 30 seconds Until Start! cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1");

                } catch (err) {

                }
                setTimeout(() => {
                    try {
                        client.action(result[id].name, "cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 20 seconds Until Start! cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1");

                    } catch (err) {

                    }
                }, 10000);
                setTimeout(() => {
                    try {
                        client.action(result[id].name, "cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 10 seconds Until Start! cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1");

                    } catch (err) {

                    }
                }, 20000);
                setTimeout(() => {
                    try {
                        client.action(result[id].name, "cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 5 seconds Until Start! cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1");

                    } catch (err) {

                    }
                }, 25000);
                setTimeout(() => {
                    try {
                        client.action(result[id].name, "cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 Begin! cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1");

                    } catch (err) {

                    }
                }, 30000);
            });
        });
    } else {
        client.action(channel, `You aren't authorized to use this command!`);
    }
}