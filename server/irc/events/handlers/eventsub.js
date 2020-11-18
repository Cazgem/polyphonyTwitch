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
    if (req.twitch_hub && event.broadcaster_user_id === `46332253`) {
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
        if (eventsub.type === `channel.follow`) {
            client.action(`#${event.broadcaster_user_name}`, `Welcome in, ${event.user_name}!`);
        } else if (eventsub.type === `channel.update`) {
            console.log(JSON.stringify(event));
        } else if (eventsub.type === `channel.subscribe`) {
            client.action(`#${event.broadcaster_user_name}`, `Welcome to the Jank Police, ${event.user_name}!`);
        } else if (eventsub.type === `channel.cheer`) {
            client.action(`#${event.broadcaster_user_name}`, `${event.user_name} has cheered ${bits} Bits! ${message}`);
        } else if (eventsub.type === `stream.online`) {
            client.action(`#${event.broadcaster_user_name}`, `${event.broadcaster_user_name} has started streaming!`);
        } else if (eventsub.type === `stream.offline`) {
            client.action(`#${event.broadcaster_user_name}`, `${event.broadcaster_user_name} has stopped streaming!`);
        } else if (eventsub.type === `channel.ban`) {
            client.action(`#${event.broadcaster_user_name}`, `${event.user_name} has been BANNED!`);
        } else if (eventsub.type === `channel.unban`) {
            client.action(`#${event.broadcaster_user_name}`, `${event.user_name} has been UNBANNED`);
        } else {
            res.send('Ok');
        }

    }
}