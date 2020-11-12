exports.run = (client, cname, params, context, channel, polyphony) => {
    if (cname === `so`) {
        client.action(channel, `Be sure to check out ${params[0].replace("@", "")} sometime at https://twitch.tv/${params[0].replace("@", "")} !`);
    } else if (cname === `rso`) {
        let name = params[0].replace("@", "");
        polyphony.Twitch.userID(name, function (err, res) {
            polyphony.Twitch.channels(res, function (err, shoutout) {
                client.action(channel, `Be sure to check out ${shoutout.broadcaster_name} sometime at https://twitch.tv/${shoutout.broadcaster_name} ! They were last playing ${shoutout.game_name}`);
            });
        })
    }
}