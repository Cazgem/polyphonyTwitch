exports.run = (client, msg, params, context, channel, polyphony) => {
    const polyphonyAltNames = [`polyphony`, `Polyphony`, `P0lyphony`, `Po1yphony`, `POlyphony`, `POLYPHONY`];
    const cazgemAltNames = [`cazgem`, `Cazgem`, `Caz`, `caz`, `CAZGEM`];
    if (cazgemAltNames.includes(params[0])) {
        polyphony.OBS.trigger('Derp!', 2, function (err, res) {
            if (err) { console.log(err) }
        })
    } else if (polyphonyAltNames.includes(params[0])) {
        if (context.mod) {
            client.action(channel, `I'm not going to dignify that, @${context['display-name']}.....`);
        } else {
            client.action(channel, `Everyone, ` + msg + ` has de-`);
            setTimeout(() => {
                client.action(channel, `wait a minute...... I don't derp! You're the derp!`);
            }, 500);
            setTimeout(() => {
                client.deletemessage(channel, context.id);
            }, 2000);
            setTimeout(() => {
                client.action(channel, `There we are.... Like it never happened! Kappa`);
            }, 3000);
            setTimeout(() => {
                client.action(channel, `!derp ${context['display-name']}`);
            }, 4000);
            setTimeout(() => {
                client.action(channel, `Everyone, ${context['display-name']} has derped. What a DERP!`);
            }, 5200);
        }
    } else if (msg === '') {
        client.action(channel, `Everyone, ${context['display-name']} has derped. What a DERP!`);
    } else {
        client.action(channel, `Everyone, ` + msg + ` has derped. What a DERP!`);
    }
}