exports.run = (client, message, params, context, channel, polyphony) => {
    if (context['display-name'] === 'Cazgem') {
        polyphony.Twitch.channels(context['room-id'], function (err, channel_data) {
            // polyphony.Twitter.send(`I'm live with ${channel_data.game_name} at https://twitch.tv/${context['display-name']} ${channel_data.title.split(" | ")[0]}`);
            client.action(`#${context['display-name']}`, `${context['display-name']} has started streaming! https://twitch.tv/${context['display-name']}.`);
        });
    }
}