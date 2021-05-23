exports.run = (client, msg, params, context, channel, polyphony) => {
    if (msg) {
        client.action(channel, `Here's your ${msg}, ${context["display-name"]}! Anything else?`);
    }
}