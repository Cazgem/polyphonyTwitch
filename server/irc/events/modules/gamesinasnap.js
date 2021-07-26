const config = require('../../config');
const mysql = require(`mysql`);
exports.run = (cname, client, msg, params, context, channel, cias) => {
    if (cname == 'gias') {
        let _cname = params[0];
        let message = msg.slice(cname.length + 3 + _cname.length);
        if ((params[0] == 'timer') && ((context.mod) || (context['room-id'] === context['user-id']))) {
            console.log(`${chan}`);
            cias.timer(channel, params[1]);
        } else if (_cname == 'time') {
            client.action(channel, `Time Remaining: ${cias.time_remaining}`);
        } else if ((_cname == 'announce') && ((context.mod) || (context['room-id'] === context['user-id']))) {
            cias.announce(channel, message);
        } else if ((_cname == 'start') && ((context.mod) || (context['room-id'] === context['user-id']))) {
            cias.starting(channel, params[1]);
        } else if ((_cname == 'route') && ((context.mod) || (context['room-id'] === context['user-id']))) {
            cias.route(params[1], message.slice(params[1].length + 1));
        } else if (_cname == 'participant') {
            cias.participant(params[1], function (err, res) { client.action(channel, `${res.name}: https://twitch.tv/${res.twitch}`) });
        } else if (_cname == 'participants') {
            cias.participants(function (err, res) {
                if (err) {
                    cias.error(err);
                } else {
                    if (typeof res[0] !== `undefined`) {
                        try { client.action(channel, `Participant 1 (${res[0].name}): https://twitch.tv/${res[0].twitch}`); } catch (err) { }
                        try { client.action(channel, `Participant 2 (${res[1].name}): https://twitch.tv/${res[1].twitch}`); } catch (err) { }
                        try { client.action(channel, `Participant 3 (${res[2].name}): https://twitch.tv/${res[2].twitch}`); } catch (err) { }
                        try { client.action(channel, `Participant 4 (${res[3].name}): https://twitch.tv/${res[3].twitch}`); } catch (err) { }
                    } else {
                        try { client.action(channel, `Participant 1 (${res[1].name}): https://twitch.tv/${res[1].twitch}`); } catch (err) { }
                        try { client.action(channel, `Participant 2 (${res[2].name}): https://twitch.tv/${res[2].twitch}`); } catch (err) { }
                        try { client.action(channel, `Participant 3 (${res[3].name}): https://twitch.tv/${res[3].twitch}`); } catch (err) { }
                        try { client.action(channel, `Participant 4 (${res[4].name}): https://twitch.tv/${res[4].twitch}`); } catch (err) { }
                    }
                }
            });
        } else if ((_cname == 'join') && ((context.mod) || (context['room-id'] === context['user-id']))) {
            cias.join();
        } else if ((_cname == 'part') && ((context.mod) || (context['room-id'] === context['user-id']))) {
            cias.part();
        } else if ((_cname == `event`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
            if (params[1] == 'close') {
                client.action(channel, `Event ${cias.event_id} Closed`);
                cias.event_id = null;
            } else if (params[1]) {
                cias.setEvent(params[1], function (err, res) {
                    client.action(channel, res);
                })
            } else {
                if (typeof cias.event_id === undefined) {
                    client.action(channel, `No Event Selected`);
                } else {
                    client.action(channel, `Event ${cias.event_id} Selected`);
                }
            }
        } else {
            console.log(params[1])
        }
        return;
    }
}