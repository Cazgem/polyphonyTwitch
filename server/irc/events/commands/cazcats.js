exports.run = (client, msg, params, context, channel, polyphony) => {
    polyphony.OBS.trigger('CazCatz', 60, function (err, res) {
        if (err) { console.log(err) }
    })
}