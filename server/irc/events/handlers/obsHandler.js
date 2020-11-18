const config = require('./../../config.js');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
exports.run = (client, msg, context, channel, polyphony) => {
    let params = msg.slice(1).split(' ');
    let cname = params.shift().toLowerCase();
    if ((context.mod) || (context['room-id'] === context['user-id'])) {
        // console.log(params)
        // console.log(`Cname = ${cname}`)
        if (cname === `mute`) {
            let source = params[0];
            polyphony.OBS.mute(source, function (err, res) {
                console.log(err)
            })
        } else if (cname === `obstest`) {
            polyphony.OBS.test(function (err, res) {
                console.log(res)
            })
        } else if (cname === `obsver`) {
            polyphony.OBS.version(`obs`, function (err, res) {
                console.log(res)
            })
        } else if (cname === `scene`) {
            if (params[0] === `list`) {
                polyphony.OBS.getScene(function (err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        client.action(channel, `Scenes List Here`)
                    }
                })
            } else if (params[0]) {
                let input = params[0];
                polyphony.OBS.setScene(input, function (err, res) {
                    if (err) {
                        console.log(err)
                    }
                })
            } else {
                polyphony.OBS.getScene(function (err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        client.action(channel, `Current Scene: ${res["current-scene"]}`)
                    }
                })
            }
        } else if (cname === `trigger`) {
            let item = params[0];
            let time = params[1];
            polyphony.OBS.trigger(item, time, function (err, res) {
                if (err) { console.log(err) }
            })
        } else if (cname === `unmute`) {
            let source = params[0];
            polyphony.OBS.unmute(source, function (err, res) {
                console.log(err)
            })
        } else if (cname === `vol`) {
            if (params[1]) {
                let source = params[0];
                let vol = params[1];
                polyphony.OBS.getVol(source, function (err, current) {
                    polyphony.OBS.setVol(source, vol, function (err, res) {
                        if (err) {
                            console.log(err)
                        } else {
                            client.action(channel, `Volume of ${source} Changed from ${current} to ${vol}.`)
                        }
                    })
                })
            } else if (params[0]) {
                let source = params[0];
                polyphony.OBS.getVol(source, function (err, vol) {
                    if (err !== null) {
                        console.log(err)
                    } else {
                        client.action(channel, `Volume of ${source} is currently ${vol}.`)
                    }
                })
            } else {
                client.action(channel, `Usage: !vol <source> (returns current level), !vol <source> <int> (sets source volume)`)
            }
        }
    }
}