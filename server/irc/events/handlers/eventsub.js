const config = require('../../config');
const Newsticker = require(`caznews`);
const caznews = new Newsticker(config, 60, config.obs.address);
exports.run = (req, res, polyphony, client, fs, path) => {
    let event = req.body.event;
    let eventsub = req.body.subscription;
    // handle the subscriptions callback/setup
    if (req.body.hasOwnProperty('subscription') && req.headers.hasOwnProperty('twitch-eventsub-message-type')) {
        if (req.body.hasOwnProperty('challenge') && req.headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
            console.log('Got a challenge, returning the challenge');
            res.send(encodeURIComponent(req.body.challenge));
            return;
        }
    }
    if (req.twitch_hub) {
        res.send('Ok');
        fs.appendFileSync(path.join(
            __dirname,
            'webhooks.log'
        ), JSON.stringify({
            body: req.body,
            headers: req.headers
        }) + "\n");
        // pretty print the last webhook to a file
        fs.appendFileSync(path.join(
            __dirname,
            'last_webhooks.log'
        ), JSON.stringify({
            body: req.body,
            headers: req.headers
        }, null, 4));
        if (event.broadcaster_user_id === `46332253`) {
            if (eventsub.type === `channel.follow`) {
                let headline = `${event.user_name} has joined our ranks! Welcome in, and enjoy the show. Did you know we have a community Discord?`;
                caznews.new(`cazgem`, headline, 60);
                client.action(`#${event.broadcaster_user_name}`, `Welcome in, ${event.user_name}! Thanks for that follow. You're welcome to join our family on !discord if you'd like to keep up-to-date and chat with us off-stream.`);
            } else if (eventsub.type === `channel.update`) {
                console.log(JSON.stringify(event));
            } else if (eventsub.type === `channel.subscribe`) {
                polyphony.Twitch.subscription(event.broadcaster_user_id, event.user_id, function (err, res) {
                    if (res.isgift) {
                        let headline = `${res.user_name} has been gifted a tier ${res.tier / 1000} sub!`;
                        caznews.new(`cazgem`, headline, 60);
                        client.action(`#${event.broadcaster_user_name}`, `cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1 HYPE! HYPE! HYPE! cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1`);
                        setTimeout(() => {
                            client.action(`#${event.broadcaster_user_name}`, `Thanks, ${gifter_name} for gifting ${event.user_name} a subscription and sharing the community vibes as well as our emotes!`);
                            setTimeout(() => {
                                client.action(`#${event.broadcaster_user_name}`, `cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1 HYPE! HYPE! HYPE! cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1`);
                            }, 500);
                        }, 1000);
                    } else {
                        let headline = `${res.user_name} has subscribed at tier ${res.tier / 1000}!`;
                        caznews.new(`cazgem`, headline, 60);
                        client.action(`#${event.broadcaster_user_name}`, `cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1 HYPE! HYPE! HYPE! cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1`);
                        setTimeout(() => {
                            client.action(`#${event.broadcaster_user_name}`, `cazgemJankPolice1 cazgemMeteor cazgemJankPolice1 Welcome to the Jank Police, ${res.user_name}! cazgemJankPolice1 cazgemMeteor cazgemJankPolice1`);
                            setTimeout(() => {
                                client.action(`#${event.broadcaster_user_name}`, `cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1 HYPE! HYPE! HYPE! cazgemJankPolice1 cazgemMeteor cazgemCazcathardhat cazgemFarmerSmokey cazgemDerp1`);
                            }, 500);
                        }, 1000);
                    }
                });
            } else if (eventsub.type === `channel.cheer`) {
                client.action(`#${event.broadcaster_user_name}`, `${event.user_name} has cheered ${event.bits} Bits! PogChamp ${event.message}`);
            } else if (eventsub.type === `stream.online`) {
                let channel_name = event.broadcaster_user_name;
                let channel = event.broadcaster_user_id;
                polyphony.Twitch.channels(channel, function (err, channel_data) {
                    polyphony.Twitter.send(`I'm live with ${channel_data.game_name} at https://twitch.tv/${channel_name} ${channel_data.title.split(" | ")[0]}`);
                    client.action(`#${channel_name}`, `${channel_name} has started streaming ${channel_data.game_name}! https://twitch.tv/${channel_name} .`);
                });
            } else if (eventsub.type === `stream.offline`) {
                client.action(`#${event.broadcaster_user_name}`, `${event.broadcaster_user_name} has stopped streaming. Thanks for stopping by, and don't forget to join the Discord for more!`);
            } else if (eventsub.type === `channel.ban`) {
                client.action(`#${event.broadcaster_user_name}`, `${event.user_name} has been BANNED!`);
            } else if (eventsub.type === `channel.unban`) {
                client.action(`#${event.broadcaster_user_name}`, `${event.user_name} has been UNBANNED`);
            } else {
            }
        }

    }
}