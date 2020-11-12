const config = require('../../config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const fs = require('fs');
const mysql = require('mysql');
const polyphony = require(`polyphony.js`);
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (client, msg, params, context, channel, self) => {

    if (channel.slice(1) === 'cazgem') {
        if ((params[0]) && ((context['user-type'] === ('mod')) || (context["display-name"] === "Cazgem"))) {
            console.log(`DEBUG obs.js entry point`);
            if (params[0] === `brb`) {
                polyphony.OBS_Scene('BRB');
            } else if (params[0] === `main`) {
                polyphony.OBS_Scene('Game');
            } else if (params[0] === `scenes`) {
                obs.connect({
                    address: config.default.obs_address,
                    password: config.default.obs_pass
                })
                    .then(
                        console.log(`DEBUG obs.js separation point 28`))
                    .then(
                        console.log(obs.GetScenes())
                    )
                    .catch(() => { // Promise convention dicates you have a catch on every chain.
                        console.log('ERROR! obs.js');
                    });
            } else if (params[0] === `desktop`) {
                polyphony.OBS_Scene(`Monitor1`);
            } else if (params[0] === `overlay`) {
                if (params[1] === `on`) {
                    console.log(`on`);
                    polyphony.OBS_show(`Overlay 2`);
                } else if (params[1] === `off`) {
                    console.log(`off`);
                    polyphony.OBS_hide(`Overlay 2`);
                }
            } else if (params[0] === `mute`) {
                polyphony.OBS_mute(`${params[1]}`)
            } else if (params[0] === `unmute`) {
                polyphony.OBS_unmute(`${params[1]}`)
            } else if (params[0] === `vol`) {
                if (params[2]) {
                    polyphony.OBS_SetVolume(`${params[1]}`, parseFloat(params[2] / 10))
                } else {
                    polyphony.OBS_GetVolume(`${params[1]}`)
                }
            }
        }
    } else if (channel.slice(1) === 'citiesinasnap') {
        if ((params[0]) && ((context['user-type'] === ('mod')) || (context["display-name"] === "citiesinasnap"))) {
            if (params[0] === `quad`) {
                polyphony.OBS_Scene('Quadrants');
            } else if (params[0] === `focus1`) {
                polyphony.OBS_Scene('Focus 1');
            } else if (params[0] === `focus1chat`) {
                polyphony.OBS_Scene('Focus 1 w/ chat');
            } else if (params[0] === `focus2`) {
                polyphony.OBS_Scene('Focus 2');
            } else if (params[0] === `focus2chat`) {
                polyphony.OBS_Scene('Focus 2 w/ chat');
            } else if (params[0] === `focus3`) {
                polyphony.OBS_Scene('Focus 3');
            } else if (params[0] === `focus3chat`) {
                polyphony.OBS_Scene('Focus 3 w/ chat');
            } else if (params[0] === `focus4`) {
                polyphony.OBS_Scene('Focus 4');
            } else if (params[0] === `focus4chat`) {
                polyphony.OBS_Scene('Focus 4 w/ chat');
            } else if (params[0] === `host`) {
                polyphony.OBS_Scene('Focus Host');
            }
        }
    } else {
        return;
    }

}