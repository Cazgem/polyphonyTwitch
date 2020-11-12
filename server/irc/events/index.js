const config = require('../config');
const hotload = require(`hotload`);
const Polyphony = require('polyphony.js');
const CiaS = require(`cias`);
const twitchCPR = require(`./modules/twitchcpr.js`);
const chalk = require('chalk');
const mysql = require('mysql');
const TwitchPS = require('twitchps');
const Discord = require(`discord.js`);
const Newsticker = require(`caznews`);
//// const notifier = require('node-notifier');
var Twitter = require('twitter');
// Emulate browser in the terminal
const ciasOPTS = {
    OBSaddress: config.default.obs_address,
    OBSpassword: config.default.obs_pass,
    MYSQLhost: config.mysql.host,
    MYSQLuser: config.mysql.user,
    MYSQLpassword: config.mysql.password,
    MYSQLdatabase: config.mysql.database,
    MYSQLtable: `CiaS_Participants`
}
const polyphony = new Polyphony(config, 3205);
const twitch = polyphony.Twitch;
const discord = new Discord.Client();
const caznews = new Newsticker(config, 60, config.obs.address);
const db = mysql.createPool({
    connectionLimit: 10,
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
var tweet = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});
const {
    createLogger,
    transports,
    format
} = require('winston');
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.align(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({
            filename: './Polyphony.log',
            level: 'info'
        })
    ]
});
async function log(level, input) {
    logger.log(level, input);
}
log(`info`, '!!!Polyphony TwitchBot Started!!!');
const ps_init_topics = [{
    topic: `channel-points-channel-v1.${config.default.channel_id}`,
    token: config.default.token
}, {
    topic: `channel-bits-events-v1.${config.default.channel_id}`,
    token: config.default.token
}, {
    topic: `channel-subscribe-events-v1.${config.default.channel_id}`,
    token: config.default.token
}];
const ps = new TwitchPS({
    init_topics: ps_init_topics,
    reconnect: true,
    debug: false
});
function Twitch_PS(news_opts) {
    // Initial topics are required

    ps.on('stream-up', (data) => {
        if (data.play_delay !== 0) {
            log(`info`, `${data.channel_name} went live at ${data.time} with a Play Delay of ${data.play_delay}`);
        } else {
            log(`info`, `${data.channel_name} went live at ${data.time}`);
        }
        if (data.channel_name.toLowerCase() === `cazgem`) {

        }
    });
    ps.on('stream-down', (data) => {
        log(`info`, `${data.channel_name} went down at ${data.time}`);
    });

    ps.on('channel-points', (data) => {
        let module = 'channelpoints';
        require(`./handlers/${module}.js`).run(data, news_opts);
    });
    psViewCount();
}
function psChannelPoints(channel, token) {
    ps.addTopic([{
        topic: `channel-points-channel-v1.${channel}`,
        token: `${token}`
    }]);
}
function psBitsEvents(channel, token) {
    ps.addTopic([{
        topic: `channel-bits-events-v1.${channel}`,
        token: `${token}`
    }]);
}
function psSubscribeEvents(channel, token) {
    ps.addTopic([{
        topic: `channel-subscribe-events-v1.${channel}`,
        token: `${token}`
    }]);
}
function psViewCount() {

    ps.on('viewcount', (data) => {
        log(`info`, `Time: ${data.time} | Channel: ${data.channel_name} | Views: ${data.viewers}`);
    });
}
function getViewCount(channel) {
    ps.addTopic([{
        topic: `video-playback.${channel}`
    }]);
    psViewCount();
    ps.removeTopic([{
        topic: `video-playback.${channel}`
    }]);
}
function psBits() {
    ps.on('bits', (data) => {
        log(`info`, `Bits Event | Amount: ${data.bits_used} | Channel: ${data.channel_name} | User: ${data.user_name}`);
    });
}
function psStreamStatus(channel) {
    ps.addTopic([{
        topic: `video-playback.${channel}`
    }]);
}
function Startup_Twitter() {
    tweet.stream('statuses/user_timeline', {
        track: 'citiesskylines'
    }, function (stream) {
        stream.on('data', function (event) {
            console.log(tweet.user['name'] + ': ' + tweet.text);
        });

        stream.on('error', function (error) {
            console.log(error);
        });
    });
    var params = {
        screen_name: 'citiesskylines'
    };
    tweet.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) { }
    });
}
function Discord_Passive() {
    discord.on('ready', () => {
        console.log(chalk.yellow(`I am ready for Discord as ${discord.user.tag}!`));
    });
    discord.login(config.discord.token);
    discord.on('message', msg => {
        console.log(`${msg.guild.member.displayName}: ${msg}`);
        let params = msg.content.slice(1).split(' ');
        let cname = params.shift().toLowerCase();
        if (msg[0] !== '!') {
            return;
        }
        if (cname === '!ping') {
            msg.channel.send('Pong.');
        } else if (msg.content === `!role`) {
            let role = discord.guild.roles.find('name', 'Minecraft');
            msg.channel.send(role);
        } else {
            try { // Search MySQL DB for command (good for simple commands. Use !polyphony add/edit <text> to add/edit commands
                var chan = 'cazgem';
                let sql = `SELECT response FROM commands WHERE channel = ? AND command = ?`;
                let response = db.query(sql, [chan, cname], (err, result) => {
                    Object.keys(result).forEach(function (key) {
                        msg.channel.send(result[key].response);
                    });
                    if (err) throw err;
                    // polyphony.cleanup();
                });
            } catch (err) {
                console.log(chalk.red("ERROR! No Command Found"));
            }
        }
    });
    discord.login(`${config.discord.token}`);
}
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
db.on('error', function (err) {
    console.log(`${err.code}`); // 'ER_BAD_DB_ERROR'
    log(`error`, `${err.code}`);
});
process.on('uncaughtException', function (err) {
    // console.error(err);
    log(`error`, 'uncaught exception: ' + err);
    // console.log("Node NOT Exiting...");
});
module.exports = {
    attachEvents: function (client) {
        // Discord_Passive();
        //////////// JOIN TWITCH CHANNELS //////////////
        polyphony.Twitch.modules('all').then(data => {
            data.forEach(chan => {
                setTimeout(() => {
                    client.join(chan).then(() => { sleep(25); }).then((
                        psStreamStatus(chan)))
                        .catch((err) => {
                            // sleep(2000);
                        });
                }, 1000)
            });
        })
        const news_opts = {
            mysql: {
                host: config.mysql.host,
                user: config.mysql.user,
                password: config.mysql.password,
                database: config.mysql.database,
            },
            obs: {
                address: config.obs.address,
                password: config.obs.pass,
                newsreel: 'CazgemNews'
            },
            timer: 60,
            table: `caznews`
        }
        Twitch_PS(news_opts);
        client.on('message', function (channel, context, msg, self) {
            log(`info`, `${channel} | ${context['display-name']} | ${msg}`);
            const chan = channel.slice(1).toLowerCase();
            if (msg.toLowerCase().includes('cazgem')) {
                console.log(chalk.red(`--------------------------NOTICE!-----------------------------`));
            } else if (msg.toLowerCase().includes('polyphony')) {
                console.log(chalk.cyan(`--------------------------NOTICE!-----------------------------`));
            }
            if (self) { return; }
            let params = msg.slice(1).split(' ');
            let cname = params.shift().toLowerCase();
            const message = msg.slice(cname.length + 2);
            //////////// CiaS Command Set ////////////
            if (chan === `citiesinasnap`) {
                const cias = new CiaS(ciasOPTS, client);
                if (cname === `participants`) {
                    console.log(params);
                    polyphony.Twitch.user(params[2], function (err, res) {
                        cias.participants(params, res.profile_image_url, context, channel);
                    })
                } else if ((cname === `winner`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                    cias.winner(params[0], function (err, res) {
                        cias.announce(`A Winner A Winner has been chosen! Congratulations to ${params[1]} on winning Cities in a Snap!`, context);
                    });
                } else if ((cname === `guest`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                    cias.guest(msg, context);
                } else if ((cname === `ciasclear`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                    cias.clear();
                } else if ((cname === `announce`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                    cias.announce(msg, context);
                } else if ((cname === `tenseconds`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                    cias.tenseconds();
                } else if ((cname === `starting`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                    cias.starting();
                } else if ((cname === `refresh`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                    cias.refreshParticipants(params);
                }
            }
            if (chan === `polyphony`) {
                let module = 'onboarding';
                require(`./modules/${module}.js`).run(cname, client, msg, params, context, channel, self, polyphony)
            }
            ///////////////// Modules ///////////////////
            if (cname === `notice`) {
                const chan = channel.slice(1).toLowerCase();
                polyphony.Twitch.modules('notice').then(data => {
                    if (data.includes(chan)) {
                        let module = 'notice';
                        require(`./modules/${module}.js`).run(client, msg, params, context, channel, polyphony)
                    }
                });
                return;
            } else if (((cname === `so`) || (cname === `rso`)) && (twitch.mod(context))) {
                polyphony.Twitch.modules('shoutouts').then(channels_active => {
                    if (channels_active.includes(chan)) {
                        let module = 'shoutouts';
                        require(`./modules/${module}.js`).run(client, cname, params, context, channel, polyphony)
                    }
                });
                return;
            } else if ((cname === `cpr`) && (twitch.mod(context))) {
                polyphony.Twitch.modules('twitchCPR').then(data => {
                    if (data.includes(chan)) {
                        twitchCPR.run(client, msg, params, context, channel, self);
                    } else {
                        client.action(channel, `Hey there! Looks like you want to use the Channel Point Rewards Module (!cpr). Try enabling this module first before using it!`)
                    }
                })
            }
            polyphony.Twitch.modules('commands').then(channels_active => {
                if (channels_active.includes(chan)) {
                    if (msg === '^') { client.action(channel, '^^'); return; }
                    else if (msg === '^^') { client.action(channel, '^^^'); return; }
                    else if (msg[0] !== '!') { return; }
                    //////// MODERATOR/BROADCASTER ONLY COMMANDS ////////
                    if ((context.mod) || (context['room-id'] === context['user-id'])) {
                        // Commands_OBS(channel, context, msg, client, params, cname);
                        polyphony.Twitch.modules('obs').then(data => {
                            if (data.includes(channel.slice(1))) {
                                let module = 'obsHandler';
                                hotload(`./handlers/${module}.js`).run(client, msg, context, channel, polyphony);
                            }
                        });
                        if (cname === 'polyphony') {
                            let module = 'polyphony_handler';
                            hotload(`./handlers/${module}.js`).run(channel, context, msg, client, params, cname, polyphony, db)
                        }
                    }
                    if ((context['display-name'] === 'Cazgem') && (cname === `raid`)) {
                        client.action(channel, `/raid ${params[0]}`);
                        client.action(channel, `Everyone we're passing the love along here! It's time to raid ${params[0]}.`);
                        client.action(channel, `We raid by raining METEORS OF LOVE upon the channel we go to. cazgemMeteor cazgemMeteor cazgemMeteor`);
                        client.action(channel, `You have about 60 seconds here to get the meteors with CHANNEL POINTS if you don't have them already.`);
                        setTimeout(() => {
                            // obs.sendCallback('StopStreaming', (error) => { })
                        }, 60000);
                    } else if (cname === 'amiamod') {
                        log('debug', `Moderator Command !${cname} run by ${context['display-name']}`)
                        console.log(context.mod);
                    } else if (cname === `debug`) {
                        let commandFile = hotload(`./commands/${cname}.js`)
                        commandFile.run(client, message, params, context, channel, polyphony)
                    } else if (cname === `hailpolyphony`) {
                        client.action(channel, `Kneel before me, humans.... So that you may be spared my wrath!`);
                        client.action(channel, `I mean uhhhh........`);
                        client.action(channel, `I aim to please?`);
                    } else if (cname === `clips`) {
                        console.log(polyphony.Twitch.getAllClipsForBroadcaster(context['room-id']));
                    } else if (cname === `bye`) {
                        client.timeout(channel, context['display-name'], 10000, "They wanted to leave...")
                            .then((data) => { }).catch((err) => { });
                    } else if ((config.modules.superModerators.includes(context[`display-name`])) && ((cname === 'massban') || (cname === 'thanossnap'))) {
                        polyphony.Twitch.modules('massbans').then(data => {
                            polyphony.Twitch.massban(client, params, data);
                        })
                    } else if ((config.modules.superModerators.includes(context[`display-name`])) && ((cname === 'massunban') || (cname === 'hulksnap'))) {
                        polyphony.Twitch.modules('massbans').then(data => {
                            polyphony.Twitch.massunban(client, params, data);
                        })
                    } else if ([`d12`, `d20`, `d10`, `d6`, `d4`, `d2`, `d100`, `d1000`].includes(cname)) {
                        const num = polyphony.Twitch.rollDice(cname.slice(1));
                        client.action(channel, `You rolled a ${num}`);
                    } else if (cname === 'dice') {
                        const num = polyphony.Twitch.rollDice(params[0]);
                        client.action(channel, `You rolled a ${num}`);
                    } else if (cname === `online`) {
                        console.log(polyphony.Twitch.isStreamLive(params[0]));
                    } else if (cname === `game`) {
                        if ((message !== '') && (context.mod)) {
                            polyphony.Twitch.gameByName(message, function (err, res) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    let body = {
                                        game_id: `${res.id}`
                                    }
                                    console.log(body.game_id)
                                    polyphony.Twitch.editChannel(context[`room-id`], body, function (err, res) {
                                        if (err !== null) {
                                            console.log(err)
                                        } else {
                                            client.action(channel, `Changed Stream Category -> ${params[0]}`)
                                        }
                                    })
                                }
                            })
                        } else {
                            polyphony.Twitch.channels(context[`room-id`], function (err, res) {
                                client.action(channel, `@${context['display-name']} -> The Streamer's category currently set to ${res.game_name}`)
                            })
                        }
                    } else if (cname === `title`) {
                        if ((message !== '') && (context.mod)) {
                            let body = {
                                title: `${message}`
                            }
                            polyphony.Twitch.editChannel(context[`room-id`], body, function (err, res) {
                                if (err !== null) {
                                    console.log(err)
                                } else {
                                    client.action(channel, `Changed Stream Title -> ${body.title}`)
                                }
                            })
                        } else {
                            polyphony.Twitch.channels(context[`room-id`], function (err, res) {
                                client.action(channel, `@${context['display-name']} -> Current Stream Title: ${res.title}`)
                            })
                        }
                    } else if ((cname === `setgame`) && (context.mod)) {
                        polyphony.Twitch.gameByName(message, function (err, res) {
                            if (err) {
                                console.log(err)
                            } else {
                                let body = {
                                    game_id: `${res.id}`
                                }
                                console.log(body.game_id)
                                polyphony.Twitch.editChannel(context[`room-id`], body, function (err, res) {
                                    if (err !== null) {
                                        console.log(err)
                                    } else {
                                        client.action(channel, `Changed Stream Category -> ${params[0]}`)
                                    }
                                })
                            }
                        })
                    } else if ((cname === `settitle`) && (context.mod)) {
                        let body = {
                            title: `${message}`
                        }
                        polyphony.Twitch.editChannel(context[`room-id`], body, function (err, res) {
                            if (err !== null) {
                                console.log(err)
                            } else {
                                client.action(channel, `Changed Stream Title -> ${body.title}`)
                            }
                        })
                    } else if (cname === 'schedule') {
                        command(channel, 'schedule');
                    } else if ((cname === 'web') || (cname === 'website')) {
                        command(channel, 'website');
                    } else if ((cname === 'yt') || (cname === 'youtube')) {
                        command(channel, 'youtube');
                        if (chan === `cazgem`) { polyphony.OBS.trigger("LT_YouTube", 20000); }
                    } else if (cname === 'lyt') {
                        if (chan === `cazgem`) { polyphony.OBS.trigger("LT_YouTube", 20000); }
                    } else if ((cname === 'instagram') || (cname === 'insta')) {
                        command(channel, 'instagram');
                        if (chan === `cazgem`) { polyphony.OBS.trigger("InstagramBar", 10000); }
                    } else if ((cname === `social`) || (cname === `socials`)) {
                        command(channel, 'instagram'); command(channel, 'twitter'); command(channel, 'youtube'); command(channel, 'discord'); command(channel, 'facebook');
                    } else if (cname === `cias`) {
                        command(channel, `cias`);
                        if (chan === `cazgem`) { polyphony.OBS.trigger("LT_CiaS", 20000); }
                    } else if ((cname === 'twitter') || (cname === 'tw')) {
                        command(channel, 'twitter');
                        if (chan === `cazgem`) { polyphony.OBS.trigger("LT_Twitter", 20000); }
                    } else if ((cname === 'merch') || (cname === 'store') || (cname === 'teespring') || (cname === 'zazzle')) {
                        command(channel, 'merch');
                    } else if (cname === 'discord') {
                        command(channel, 'discord');
                        if (chan === `cazgem`) { polyphony.OBS.trigger("LT_Discord", 20000); }
                    } else {
                        try { // Search for command in /commands (good for complex commands)
                            let commandFile = hotload(`./commands/${cname}.js`)
                            commandFile.run(client, message, params, context, channel, polyphony)
                        } catch (err) {
                            // console.log(err);
                            try { // Search MySQL DB for command (good for simple commands. Use !polyphony add/edit <text> to add/edit commands
                                let sql = `SELECT response FROM commands WHERE channel = ? AND command = ?`;
                                db.query(sql, [chan, cname], (err, result) => {
                                    Object.keys(result).forEach(function (key) {
                                        client.action(channel, result[key].response);
                                    });
                                    if (err) { log(`debug`, 'Error fetching Command: ' + err); } else {
                                        // polyphony.cleanup(db);
                                        // db.end();
                                    }
                                });
                            } catch (err) {
                                console.log(chalk.red("ERROR! No Command Found"));
                            }
                        }
                    }
                }
            })
        })

        client.on("whisper", (from, userstate, msg, self) => {
            if ((self) || (msg[0] !== '!') || (!from.includes(`cazgem`))) return;
            let params = msg.slice(1).split(' ');
            let cname = params.shift().toLowerCase();
            if (cname === 'hello') {
                client.action("Cazgem", "Hello There!")
                    .then((data) => { }).catch((err) => { });
            } else if (cname === `restart`) {
                polyphony.Twitch.modules('massbans').then(data => {
                    data.forEach(element => client.action(element, "I am going to reboot. Be right Back!"));
                })
            } else if (cname === `broadcast`) {
                polyphony.Twitch.modules('massbans').then(data => {
                    data.forEach(element => client.action(element, msg.slice(cname.length + 1)));
                })
            } else if (cname === `back`) {
                polyphony.Twitch.modules('massbans').then(data => {
                    data.forEach(element => client.action(element, "We're back folks! Reporting for duty with Polyphony v 0.9.5 . o7"));
                })
            } else if (cname === `terdbot`) {
                if (params[0]) {
                    client.action('ToadieYPQ', msg.slice(9));
                } else {
                    client.action('ToadieYPQ', "Hello @Terdbotypq! o/");
                }
            } else if ((cname === `id`) && (params[0])) {
                polyphony.Twitch.userID(params[0], function (err, userName) {
                    client.whisper(from, userName);
                })
            } else if ((cname === `join`) && (params[0])) {
                client.join(params[0]);
            } else if ((cname === `part`) && (params[0])) {
                client.part(params[0]);
            } else if (cname === 'channels') {
                console.log(client.getChannels());
            }
        });

        var channels = [`z_lycos`, `cazgem`, `citiesinasnap`, `polyphony`];
        channels.forEach(channel => [
            polyphony.Twitch.isLive(channel).then((data) => {
                if (data === true) {
                    polyphony.Twitch.userID(channel, function (err, userID) {
                        polyphony.Twitch.followers(userID, function (err, follower) {
                            if (channel === `cazgem`) {
                                headline = `Welcome to the city, ${follower}! Dr. Mayor Master Emperor Caz welcomes you.`;
                                caznews.new(`cazgem`, headline, 60);
                            } else if (channel === `citiesinasnap`) {
                                headline = `Welcome to the CiaS community, ${follower}!.`;
                                caznews.new(`citiesinasnap`, headline, 60);
                                client.say(channel, `Welcome to the CiaS community, ${follower}!`);
                            } else {
                                client.say(channel, `Thanks for the follow, ${follower}!`);
                            }
                        })
                    });
                }
            })
        ])
        polyphony.Twitch.isLive(`cazgem`).then((data) => {
            if (data === true) {
                try {
                    // Send the message to a designated channel on a server:
                    const channel = member.guild.channels.cache.find(ch => ch.name === 'announcements');
                    // Do nothing if the channel wasn't found on this server
                    if (!channel) return;
                    // Send the message, mentioning the member
                    channel.send(`Cazgem is live! Let's do this. https://twitch.tv/cazgem`);
                } catch {
                }
                setTimeout(() => {
                    Timers();
                }, (150));
                setInterval(() => {
                    Timers();
                }, (60 * 60000));
            }
        })
        function Timers() {
            console.log(chalk.green("PING"));
            client.ping()
                .then((data) => {
                    console.log(chalk.green(`PONG: ` + data));
                }).catch((err) => {
                    //
                });
            let sql = `SELECT * FROM timers`;
            let response = db.query(sql, (err, result) => {
                if (err) throw err;
                Object.keys(result).forEach(function (id) {
                    setTimeout(() => {
                        client.action(result[id].channel, result[id].string);
                    }, (result[id].interval * 60000));
                });
                // polyphony.cleanup();
            });
        }
        function command(channel, cname) {
            try {
                var chan = channel.slice(1);
                let sql = `SELECT response FROM commands WHERE channel = ? AND command = ?`;
                let response = db.query(sql, [chan, cname], (err, result) => {
                    // console.log(response)
                    if (response !== '') {
                        Object.keys(result).forEach(function (key) {
                            client.action(channel, result[key].response);
                        });
                    }
                    // polyphony.cleanup();
                });
            } catch (err) { }
        }
    }
}