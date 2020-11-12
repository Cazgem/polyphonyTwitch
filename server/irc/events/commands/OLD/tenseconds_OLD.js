const config = require('../../../config');
const OBSWebSocket = require('obs-websocket-js');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, db) => {
    let sql = `SELECT name FROM CiaS_Participants`;
    let response = db.query(sql, (err, result) => {
        if (err) throw err;
        Object.keys(result).forEach(function (id) {
            client.action(result[id].name, "cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 10 seconds remain! cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 ");
            client.action(result[id].name, "cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 10 seconds remain! cities1Stopwatch1 cities1Stopwatch1 cities1Stopwatch1 ");
            setTimeout(() => {
                client.action(result[id].name, "9 seconds");
            }, 1000);
            setTimeout(() => {
                client.action(result[id].name, "8");
            }, 2000);
            setTimeout(() => {
                client.action(result[id].name, "7");
            }, 3000);
            setTimeout(() => {
                client.action(result[id].name, "6");
            }, 4000);
            setTimeout(() => {
                client.action(result[id].name, "5");
            }, 5000);
            setTimeout(() => {
                client.action(result[id].name, "4");
            }, 6000);
            setTimeout(() => {
                client.action(result[id].name, "3");
            }, 7000);
            setTimeout(() => {
                client.action(result[id].name, "2");
            }, 8000);
            setTimeout(() => {
                client.action(result[id].name, "1");
            }, 9000);
            setTimeout(() => {
                client.action(result[id].name, "cities1Stop cities1Stop cities1Stop All building Must stop! cities1Stop cities1Stop cities1Stop ");
            }, 10000);
        });
    });

}