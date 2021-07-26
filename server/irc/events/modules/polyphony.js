const chalk = require(`chalk`);
exports.run = (cname, client, msg, params, context, channel, self, polyphony) => {
    let c = params[0];
    console.log(chalk.green(`Polyphony: ${c}`));
    if (c == 'rejoin') {
        polyphony.Twitch.modules('all').then(data => {
            data.forEach(chan => {
                setTimeout(() => {
                    client.join(chan).then(() => { sleep(25); }).then((
                        psStreamStatus(chan)))
                        .catch((err) => {
                            // sleep(2000);
                        });
                }, 1000)
            });
        })
    }
}