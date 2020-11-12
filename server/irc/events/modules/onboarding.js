const config = require('../../config');
const mysql = require(`mysql`);
const Promise = require(`promise`);
this.db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (cname, client, msg, params, context, channel, self, polyphony) => {
    // const twitchCPR = new TwitchCPR(twitchCPRopts, context[`room-id`], channel.slice(1));
    if (cname === 'join') {
        let load = {
            channel: context.username,
            channel_ID: context[`user-id`]
        };
        let sql = `INSERT IGNORE INTO channels SET ?`;
        let cazgemRewards = this.db.query(sql, load, (err, result) => {
            if (err) throw err;
        });
        client.join(context.username)
        client.action(channel, `Welcome to Polyphony! I've joined your channel, and you should now be able to enable/disable modules at will using the !modules command.`);
    } else if (cname === `enable`) {
        let load = {
            channel: context.username,
            channel_ID: context[`user-id`]
        };
        let sql0 = `INSERT IGNORE INTO channels SET ?`;
        let cazgemRewards0 = this.db.query(sql0, load, (err, result) => {
            if (err) throw err;
            let sql = `UPDATE channels SET ${params[0]}="1" WHERE channel_ID=?`;
            let cazgemRewards = this.db.query(sql, [load.channel_ID], (err, result) => {
                if (err) throw err;
            });
            client.action(channel, `${params[0]} module activated for ${context.username}!`);
        });
    } else if (cname === `disable`) {
        let load = {
            channel: context.username,
            channel_ID: context[`user-id`]
        };
        let sql0 = `INSERT IGNORE INTO channels SET ?`;
        let cazgemRewards0 = this.db.query(sql0, load, (err, result) => {
            if (err) throw err;
        });
        let sql = `UPDATE channels SET ${params[0]}="0" WHERE channel_ID=?`;
        let cazgemRewards = this.db.query(sql, [load.channel_ID], (err, result) => {
            if (err) throw err;
        });
        client.action(channel, `${params[0]} module de-activated for ${context.username}!`);
    } else if (cname === `modules`) {
        client.action(channel, `commands, listeners, massbans, notice, shoutouts, twitchCPR.`);
    } else if (cname === `part`) {
        let sql = `DELETE FROM channels WHERE channel_ID=?`;
        let cazgemRewards = this.db.query(sql, context[`user-id`], (err, result) => {
            if (err) throw err;
        });
        client.part(context.username)
        client.action(channel, `Sorry to see you go, ${context.username}! I've left your channel, and you can always come back anytime using the !join command.`);
    } else if (cname === `commands`) {
        client.action(channel, `Use !join to join Polyphony's network and invite me to your stream! Use !enable and !disable to enable/disable any of my modules for your channel. Use !modules for a list of modules you can enable.`);
    } else if (cname === `debug2`) {
        let sql = `SELECT channel FROM channels WHERE ${params[0]}=?`;
        this.db.query(sql, [1], (err, result) => {
            if (err) throw err;
            var channels_massbans = [];
            const channelList = new Promise((res, rej) => {
                res(result.forEach((data) => {
                    channels_massbans.push(Object.values(data)[0]);
                }))
            });
            channelList.then(() => {
                console.log(channels_massbans)
            })
        });

    } else if (cname === `addchans`) {
        // let sql = `SELECT channel FROM channels WHERE ${params[0]}=?`;
        // this.db.query(sql, [1], (err, result) => {
        //     if (err) throw err;
        //     var channels_massbans = [];
        //     const channelList = new Promise((res, rej) => {
        //         res(result.forEach((data) => {
        //             channels_massbans.push(Object.values(data)[0]);
        //         }))
        //     });
        //     channelList.then(() => {
        //         console.log(channels_massbans)
        //     })
        // });

    } else {
        client.action(channel, `Not a Recognized Command!`);
    }
}