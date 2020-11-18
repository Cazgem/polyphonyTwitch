const tmi = require('tmi.js');
const options = require('./config');
const eventHandler = require('./events');
const eventListener = require('./listeners');

const irc = {
    start: function (app, path) {
        const client = new tmi.client(options);
        client.connect();
        eventHandler.attachEvents(client, app, path);
        eventListener.attachEvents(client);
        // obsListener.attachEvents(client);
    }
};

module.exports = irc;