const config = require('../../config');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
exports.run = (client, msg, params, context, channel, self) => {
    var cname = "trafficgame";
    var chan = channel.slice(1);
    if (params[0]) {
        if ((params[0] === 'win') && ((context['user-type'] === ('mod')) || (context["display-name"] === "Cazgem"))) {
            let sql1 = `SELECT * FROM scoreboards WHERE channel = "${chan}" AND username = "${params[1]}" AND name = "trafficgame"`;
            let query1 = db.query(sql1, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result && result.length) {
                        let sql = `UPDATE scoreboards SET score = score + 1 WHERE channel=? AND username=? AND name=?`;
                        let query = db.query(sql, [chan, params[1], cname], (err, result) => {
                            if (err) throw err;
                        });
                        let sqlfetch = `SELECT score FROM scoreboards WHERE channel = "${chan}" AND username = "${params[1]}" AND name = "trafficgame"`;
                        let query1 = db.query(sqlfetch, (err, result) => {
                            if (err) throw err;
                            Object.keys(result).forEach(function (key) {
                                var row = result[key];
                                let score = row.score;
                                client.action(channel, `Congratulations ${params[1]} on your Traffic Game Win! Poooound`);
                                client.action(channel, `${params[1]} has earned ${score} wins since Jan. 25th!`);
                            });
                        });
                    } else {
                        let post = {
                            channel: chan,
                            username: params[1],
                            name: cname
                        };
                        let sql2 = `INSERT INTO scoreboards SET score =  1, ?`;
                        let query = db.query(sql2, post, (err, result) => {
                            if (err) throw err;
                        });
                        client.action(channel, `Congratulations ${params[1]} on your first Traffic Game Win! Poooound`);
                    }
                }
            })
        } else if (params[0] === 'scores') {
            let sqlfetch = `SELECT * FROM scoreboards WHERE channel = "${chan}" AND name = "trafficgame" ORDER BY score DESC LIMIT 10 `;
            let query1 = db.query(sqlfetch, (err, result) => {
                if (err) throw err;
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    let score = row.score;
                    let username = row.username;
                    client.action(channel, `${username}: ${score}`);
                });
            });
        } else if ((params[0] === 'set') && ((context['user-type'] === ('mod')) || (context["display-name"] === "Cazgem"))) {
            let score = params[2];
            let sql = `UPDATE scoreboards SET score=? WHERE channel=? AND username=? AND name=? `;
            let query = db.query(sql, [score, chan, params[1], cname], (err, result) => {
                if (err) throw err;
            });
        } else if (params[0] === 'wins') {
            let sqlfetch = `
                SELECT * FROM scoreboards WHERE channel = "${chan}"
                AND username = "${context['display-name']}"
                AND name = "trafficgame"
                `;
            let query1 = db.query(sqlfetch, (err, result) => {
                if (err) throw err;
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    let score = row.score;
                    client.action(channel, `${context['display-name']} has earned ${score} wins since Jan.25 th!`);
                });
            });
        } else {
            let sqlfetch = `
                SELECT * FROM scoreboards WHERE channel = "${chan}"
                AND username = "${params[0]}"
                AND name = "trafficgame"
                `;
            let query1 = db.query(sqlfetch, (err, result) => {
                if (err) throw err;
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    let score = row.score;
                    client.action(channel, `${params[0]} has earned ${score} wins since Jan.25 th!`);
                });
            })
        }
    } else {
        client.action(channel, 'Try !trafficgame followed by wins, or a username to find out how somebody\'s traffic game score, or "scores" to see the top ten scoreboard. Moderators, use !trafficgame win USER with proper capitalization to give the win.');
    }
}