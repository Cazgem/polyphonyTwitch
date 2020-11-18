exports.run = (channel, context, message, client, params, cname, polyphony, db) => {
    if (params[0]) {
        let cmd = params[1];
        let polyfunc = params[0];
        var chan = channel.slice(1);
        let response = message.slice(polyfunc.length + cmd.length + 2);
        if (polyfunc === 'add' || polyfunc === `new` || polyfunc === `addcom`) {
            let load = {
                channel: chan,
                command: cmd,
                response: response
            };
            let sql = 'INSERT INTO commands SET ?';
            let query = db.query(sql, load, (err, result) => {
                if (err) throw err;
            });
            client.action(channel, 'Added Command ' + cmd + ' for channel ' + channel.slice(1) + '.');
        } else if (polyfunc === 'edit' || polyfunc === 'update') {
            let sql = `UPDATE commands SET response = "${response}" WHERE command = "${cmd}" AND channel = "${chan}"`;
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            client.action(channel, 'Edited Command ' + cmd + ' for channel ' + channel.slice(1) + '.');
        } else if (polyfunc === 'rename') {
            let sql = `UPDATE commands SET command = "${response}" WHERE command = "${cmd}" AND channel = "${chan}"`;
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            client.action(channel, 'Renamed Command ' + cmd + ' for channel ' + channel.slice(1) + ' to ' + response + '.');
        } else if (polyfunc === 'cp') {
            cmd_new = params[2];
            params[1] = '';
            let sql = `SELECT response FROM commands WHERE channel = ? AND command = ?`;
            let response = db.query(sql, [chan, cmd], (err, result) => {
                Object.keys(result).forEach(function (key) {
                    let sql3 = `DELETE FROM commands WHERE command = "${cmd_new}" AND channel = "${chan}"`;
                    let query3 = db.query(sql3, (err, result) => {
                        if (err) throw err;
                    });
                    let load = {
                        channel: channel.slice(1),
                        command: cmd_new,
                        response: result[key].response
                    };
                    let sql = 'INSERT INTO commands SET ?';
                    let query = db.query(sql, load, (err, result) => {
                        if (err) throw err;
                    });
                });
            });
            client.action(channel, 'Copied Command ' + cmd + ' to ' + cmd_new + ' for channel ' + channel.slice(1) + '.');
        } else if (polyfunc === 'delete') {
            let sql = `DELETE FROM commands WHERE command = "${cmd}" AND channel = "${chan}"`;
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            client.action(channel, 'DELETED Command ' + cmd + ' for channel ' + channel.slice(1) + '.');
        }
    } else if (!params[0]) {
        client.action(channel, 'Hello there! My name is Polyphony. I am a computer program and twitch bot created by Cazgem. I currently assist in many Twitch channels, manage many websites, and manage many home and computer automation tasks for Cazgem.')

    }
}