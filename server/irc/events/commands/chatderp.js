const config = require('../../config');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, polyphony) => {
    if ((params[1]) && ((context['user-type'] === ('mod')) || (context["display-name"] === "Cazgem"))) {
        if (params[0] === 'set') {
            var chan = channel.slice(1);
            let sql = `UPDATE counters SET count = ${params[1]} WHERE channel = "cazgem" AND name = "chatderp"`;
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            let sqlfetch = 'SELECT count FROM counters WHERE id="2"';
            let count = db.query(sqlfetch, (err, result) => {
                if (err) throw err;
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    let count = row.count;
                    client.action(channel, `Chat has collectively derp'd it an astounding ${count} times since 21st October 2019. KAPOW Poooound`);
                });
            });
        }
    } else {
        var chan = channel.slice(1);
        let sql = 'UPDATE counters SET count = count + 1 WHERE channel = "cazgem" AND name = "chatderp"';
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
        });
        let sqlfetch = 'SELECT count FROM counters WHERE id="2"';
        let count = db.query(sqlfetch, (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
                var row = result[key];
                let count = row.count;
                client.action(channel, `Chat has collectively derp'd it an astounding ${count} times since 21st October 2019. KAPOW Poooound`);
            });
        });
        polyphony.OBS.trigger('Derp!', 2, function (err, res) {
            if (err) { console.log(err) }
        })
    }

}