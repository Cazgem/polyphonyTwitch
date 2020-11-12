const config = require('./config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const mysql = require('mysql');
const TwitchClient = require('twitch').default;
const PubSubClient = require('twitch-pubsub-client').default;
const clientId = '123abc';
const accessToken = 'def456';
const twitchClient = await TwitchClient.withCredentials(clientId, accessToken);
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
module.exports = {
    pubsub() {

        import PubSubClient from 'twitch-pubsub-client';

        const pubSubClient = new PubSubClient();
        await pubSubClient.registerUserListener(twitchClient);
    },
    caznews() {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            // .then(() => {
            //     return obs.send('GetsourceTypesList');
            // })
            .then(data => {
                obs.send('SetSceneItemProperties', {
                    item: 'Cazgem News',
                    visible: true
                })
                setTimeout(() => {
                    obs.send('SetSceneItemProperties', {
                        item: 'Cazgem News',
                        visible: false
                    })
                }, 120000);
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_trigger(item, time) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            .then(data => {
                obs.send('SetSceneItemProperties', {
                    item: item,
                    visible: true
                })
                setTimeout(() => {
                    obs.send('SetSceneItemProperties', {
                        item: item,
                        visible: false
                    })
                }, time);
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_switch(item, time) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            .then(data => {
                obs.send('SetSceneItemProperties', {
                    item: item,
                    visible: true
                })
                if (time) {
                    setTimeout(() => {
                        obs.send('SetSceneItemProperties', {
                            item: item,
                            visible: false
                        })
                    }, time);
                }
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_Scene(item) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            .then(() => {
                // console.log(`OBS Connection Established`);

                // console.log(`Success! We're connected & authenticated.`);

                return obs.send('GetSceneList');
            })
            .then(data => {
                console.log(`Found a different scene! Switching to Scene: ${item}`);

                obs.send('SetCurrentScene', {
                    'scene-name': item
                });
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_hide(item) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            .then(data => {
                obs.send('SetSceneItemProperties', {
                    item: item,
                    visible: false
                })
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_show(item) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            .then(data => {
                return obs.send('SetSceneItemProperties', {
                    item: item,
                    visible: true
                })
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_mute(source) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            .then(data => {
                obs.send('SetMute', {
                    source: source,
                    mute: true
                })
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_unmute(source) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            .then(() => {
                // console.log(`OBS Connection Established`);
            })
            .then(data => {
                obs.send('SetMute', {
                    source: source,
                    mute: false
                })
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_GetVolume(source) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            .then(data => {
                result = obs.send('GetVolume', {
                    source: source
                })
            })
            .then(
                console.log(result)
            )
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_SetVolume(source, volume) {
        obs.connect({
                address: config.default.obs_address,
                password: config.default.obs_pass
            })
            // .then(() => {
            // console.log(`OBS Connection Established`);
            // })
            .then(data => {
                result = obs.send('SetVolume', {
                    source: source,
                    volume: volume
                })
            })
            .then(
                console.log(result.volume)
            )
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },

    rollDice(sides) {
        return Math.floor(Math.random() * sides) + 1;
    },

    rollD12() {
        const sides = 12;
        return Math.floor(Math.random() * sides) + 1;
    },

    rollD20() {
        const sides = 20;
        return Math.floor(Math.random() * sides) + 1;
    }
};