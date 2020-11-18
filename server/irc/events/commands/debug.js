exports.run = (client, message, params, context, channel, polyphony) => {
    if (context['display-name'] === 'Cazgem') {
        polyphony.Twitch.createSubscription(params[1], params[0], function (err, res) {
            console.log(res);
        });
    }
}