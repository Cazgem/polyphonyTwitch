exports.run = (client, msg, params, context, channel, polyphony) => {
    if (params[0]) {
        client.action(channel, channel.slice(1) + `! ` + context['display-name'] + ` wants you to see what ` + params[0] + ` said. Scroll Up!`);
    } else {
        client.action(channel, channel.slice(1) + `, did you actually see ` + context["display-name"] + `'s message you missed?`);
    }
}