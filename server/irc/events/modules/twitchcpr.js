const config = require('../../config');
const TwitchCPR = require(`twitch-cpr`);
const forbidden = [`update`, `edit`, `new`, `create`, `delete`, , `copy`, `cp`, `clone`, `del`, `remove`, `list`, `debug`, `switch`, `help`, `polyphony`, `insert`, `profile`, `profiles`];
const errInvalid = `Invalid Profile Name. Please Try Something Else.`;
exports.run = (client, msg, params, context, channel, self) => {
    const twitchCPR = new TwitchCPR(config, channel.slice(1));
    if ((params[0] === `update`) || (params[0] === `edit`)) {
        if (forbidden.includes(params[1])) { client.action(channel, errInvalid); }
        else {
            twitchCPR.updateGame(params[1], context[`room-id`], channel.slice(1));
            client.action(channel, `Profile ${params[0]} updated for ${channel.slice(1)}.`);
        }
    } else if ((params[0] === `new`) || (params[0] === `create`)) {
        if (forbidden.includes(params[1])) { client.action(channel, errInvalid); }
        else {
            twitchCPR.newGame(params[1], context[`room-id`], channel.slice(1));
            client.action(channel, `Profile ${params[1]} created for ${channel.slice(1)}.`);
        }
    } else if ((params[0] === `delete`) || (params[0] === `remove`)) {
        if (forbidden.includes(params[1])) { client.action(channel, errInvalid); }
        else {
            twitchCPR.deleteGame(params[1], context[`room-id`], channel.slice(1));
            client.action(channel, `Profile ${params[1]} deleted! (for ${channel.slice(1)}).`);
        }
    } else if ((params[0] === `copy`) || (params[0] === `cp`) || (params[0] === `clone`)) {
        if (forbidden.includes(params[1])) { client.action(channel, errInvalid); }
        else {
            // twitchCPR.cloneGame(params[1], context[`room-id`], channel.slice(1));
            client.action(channel, `Feature Coming Soon!`);
        }
    } else if (params[0] === `list`) {
        if (params[1] === `all`) {
            twitchCPR.listAll(context['room-id'], channel.slice(1));
        } else if (params[1]) {
            twitchCPR.listByGame(params[1], context['room-id'], channel.slice(1));
        } else {
            twitchCPR.listGames(context['room-id'], channel.slice(1), client);
        }
    } else if (params[0] === `debug`) {
        client.action(channel, `debug profile sent!`);
    } else if (params[0] === `switch`) {
        if (forbidden.includes(params[1])) { client.action(channel, errInvalid); }
        else {
            twitchCPR.switch(params[1], context[`room-id`], channel.slice(1));
            client.action(channel, `Profile switched to ${params[1]} for ${channel.slice(1)}.`);
        }
    } else if (params[0] === `help`) {
        client.action(channel, `Use: !cpr [new, edit, delete, switch, <profileName>].`);
    } else if (params[0]) {
        if (forbidden.includes(params[0])) { client.action(channel, errInvalid); }
        else {
            twitchCPR.switch(params[0], context[`room-id`], channel.slice(1), function (err, res) {
                if (err) {
                    console.log(`ERROR: ` + err);
                } else if (res) {
                    console.log(`RESOLVE: ` + res);
                }
            });
            client.action(channel, `Profile switched to ${params[0]} for ${channel.slice(1)}.`);
        }
    } else {
        client.action(channel, `Use: !cpr [new, edit, delete, switch, <profileName>].`);
    }
}