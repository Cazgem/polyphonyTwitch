const config = require('../config');
const mysql = require('mysql');
const db = mysql.createPool({
    connectionLimit: 10,
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
const Polyphony = require('polyphony.js');
const polyphony = new Polyphony(config, 3206);
const chalk = require('chalk');
module.exports = {
    attachEvents: function (client) {
        client.on("subscription", (channel, username, method, message, userstate) => {
            console.log('subscription', { channel, username, method, message, userstate });
            if (channel.slice(1) === 'Cazgem') {
                client.say(channel, `Thanks for subscribing, ${username}! You are a legend. Welcome to the Jank Police, my friend.`);
            } else if (channel.slice(1) === 'citiesinasnap') {
                client.say(channel, `Thanks for subscribing, ${username}! Your support allows this event to continue and the community is proud to have you as a supporter of this content!`);
            } else {

            }
        });
        client.on('resub', (channel, username, _months, message, userstate, method) => {
            let streakMonths = userstate['msg-param-streak-months'];
            let cumulativeMonths = userstate['msg-param-cumulative-months'];
            let sharedStreak = userstate['msg-param-should-share-streak'];
            if (sharedStreak) {
                if (channel.slice(1) === 'Cazgem') {
                    client.say(channel, `Thanks for resubscribing for ${streakMonths} consecutive months, ${username}! The Jank Police wouldn't be the same without you, friend.`);
                } else if (channel.slice(1) === 'citiesinasnap') {
                    client.say(channel, `Thanks for subscribing, ${username}! Your support allows this event to continue and the community is proud to have you as a supporter of this content!`);
                } else {

                }
            } else {
                if (channel.slice(1) === 'Cazgem') {
                    if (cumulativeMonths === '3') {
                        client.say(channel, `Thanks for resubscribing for ${cumulativeMonths} months, ${username}! Enjoy your new ${cumulativeMonths}-month sub-badge.`);
                    } else if (cumulativeMonths === '6') {
                        client.say(channel, `Thanks for resubscribing for ${cumulativeMonths} months, ${username}! Enjoy your new ${cumulativeMonths}-month sub-badge.`);
                    } else if (cumulativeMonths === '9') {
                        client.say(channel, `Thanks for resubscribing for ${cumulativeMonths} months, ${username}! Enjoy your new ${cumulativeMonths}-month sub-badge.`);
                    } else {
                        client.say(channel, `Thanks for resubscribing for ${cumulativeMonths} months, ${username}! The Jank Police are relieved that you've returned for duty.`);
                    }
                } else {

                }
            }
        });
        client.on("raided", (channel, username, viewers) => {
            raidhype(channel, username, viewers);
        });
        // client.on("join", function (channel, username) {
        //     console.log(`${username} has joined ${channel}.`)
        // });
        client.on('message', function (channel, context, msg, self) {
            var chan = channel.slice(1);
            const channels_active = [`cazgem`, `citiesinasnap`];
            if (self) return;
            try {
                let data = {
                    channel: channel.slice(1),
                    user: context.username,
                    message: msg
                };
                let sql = `INSERT INTO chatlog SET ?`;
                let query = db.query(sql, data, (err, result) => {
                    if (err) throw err;
                });

            } catch (err) {
                console.log(chalk.red("err"));
            }
            if (channels_active.includes(chan)) {
                if (msg.includes("cazgemMeteor")) {
                    client.action(chan, "cazgemMeteor cazgemMeteor cazgemMeteor")
                } else if (msg.includes("o/ Polyphony")) {
                    client.action(chan, `o/ @` + context[`display-name`] + ` hope you're well!`)
                } else if (msg.includes("Hey Polyphony")) {
                    client.action(chan, `Hello, @` + context[`display-name`] + `!`)
                }
                let linkguard_key = [`.org`, `.net`];
                // if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(msg)) {
                //     console.log("url inside");
                // }
                if ((msg.includes("www.") || msg.includes(".com") || msg.includes(".net") || msg.includes(".org") || msg.includes(".co") || msg.includes(".ca")) && (context['user-type'] !== ('mod')) && (context[`room-id`] !== context[`user-id`]) && (context.subscriber !== true)) {
                    client.deletemessage(channel, context.id);
                    client.action(channel, context[`display-name`] + `, stop posting links! Ask for permission first.`);
                    console.log(`Link removed on ` + channel);
                }
                let params = msg.slice(1).split(' ');
                let cname = params.shift().toLowerCase();
                if (cname === 'testraid') {
                    raidhype(channel, params[0], params[1]);
                    console.log(`* Executed ${cname} command on ${channel}`);
                }
            }
        });
        async function raidhype(channel, username, viewers) {
            var chan = channel.slice(1);
            let post = {
                channel: chan,
                raider: username,
                viewers: viewers
            };
            let query = db.query(`INSERT INTO raids SET ?`, post, (err, result) => {
                if (err) throw err;
            });
            if ((chan === `cazgem`) || (chan === `citiesinasnap`)) {
                client.say(channel, `/me Welcome Raiders!`);
                setTimeout(() => {
                    client.say(channel, `/me ` + username + ` has raided the channel, bringing ` + viewers + ` friends with them. Show them some love, will ya?`);
                }, 500);
                setTimeout(() => {
                    client.say(channel, `CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch`);
                }, 1000);
                setTimeout(() => {
                    client.say(channel, `TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit `);
                }, 3000);
                setTimeout(() => {
                    client.say(channel, `/me Thank You @` + username + ` for the raid! You are a legend.`);
                }, 15000);
                setTimeout(() => {
                    polyphony.Twitch.userID(username, function (err, res) {
                        polyphony.Twitch.channels(res, function (err, shoutout) {
                            client.action(channel, `Be sure to check out ${shoutout.broadcaster_name} sometime at https://twitch.tv/${shoutout.broadcaster_name} ! They were last playing ${shoutout.game_name}`);
                        });
                    })
                }, 20000);
                setTimeout(() => {
                    client.say(channel, `/me Welcome to all our raiders. Feel free to chat, or lurk, it's your choice, but please remember to remove the '?referrer=raid' part of the url and refresh the stream, first. Thanks! `);
                }, 30000);
            }
        }
        async function subhype(channel, username, viewers) {
            var chan = channel.slice(1);
            let post = {
                channel: chan,
                raider: username,
                viewers: viewers
            };
            let query = db.query(`INSERT INTO raids SET ?`, post, (err, result) => {
                if (err) throw err;
            });
            if ((chan === `cazgem`) || (chan === `citiesinasnap`)) {
                client.say(channel, `/me Welcome Raiders!`);
                setTimeout(() => {
                    client.say(channel, `/me ` + username + ` has raided the channel, bringing ` + viewers + ` friends with them. Show them some love, will ya?`);
                }, 500);
                setTimeout(() => {
                    client.say(channel, `CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch twitchRaid TwitchLit TombRaid TwitchLit bleedPurple CurseLit imGlitch`);
                }, 1000);
                setTimeout(() => {
                    client.say(channel, `TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit KAPOW TwitchUnity TwitchSings Poooound TwitchSings TwitchLit `);
                }, 3000);
                setTimeout(() => {
                    client.say(channel, `/me Thank You @` + username + ` for the raid! You are a legend.`);
                }, 15000);
                setTimeout(() => {
                    polyphony.Twitch.userID(username, function (err, res) {
                        polyphony.Twitch.channels(res, function (err, shoutout) {
                            client.action(channel, `Be sure to check out ${shoutout.broadcaster_name} sometime at https://twitch.tv/${shoutout.broadcaster_name} ! They were last playing ${shoutout.game_name}`);
                        });
                    })
                }, 20000);
                setTimeout(() => {
                    client.say(channel, `/me Welcome to all our raiders. Feel free to chat, or lurk, it's your choice, but please remember to remove the '?referrer=raid' part of the url and refresh the stream, first. Thanks! `);
                }, 30000);
            }
        }
    }
}