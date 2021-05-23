exports.run = (client, msg, params, context, channel, self) => {
    if (msg) {
        client.action(channel, context["display-name"] + ' has blamed ' + msg + '. Who do you blame?');
    } else {
        client.action(channel, `Time for the blame game!`);
    }
}