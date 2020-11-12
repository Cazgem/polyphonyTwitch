const config = require('../../config');
exports.run = (client, msg, params, context, channel, self) => {
    client.action(channel, 'Twitter: ' + config.social[channel.slice(1)].twitter + ' || YouTube: ' + config.social[channel.slice(1)].youtube + ' || Instagram: ' + config.social[channel.slice(1)].instagram + ' || Reddit: ' + config.social[channel.slice(1)].reddit);
}