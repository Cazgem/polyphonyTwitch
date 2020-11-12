exports.run = (client, msg, params, context, channel, polyphony) => {
    polyphony.OBS.trigger('Jank!', 2, function (err, res) {
        if (err) { console.log(err) }
    })
}