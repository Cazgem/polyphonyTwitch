const config = require('./config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
module.exports = {
    OBS_Sources() {
        obs.connect({
            address: config.default.obs_address,
            password: config.default.obs_pass
        })
            .then(data => {
                return obs.send(`GetSourcesList`)
            }).then(data => {
                console.log(data);
            })
            .catch(err => { // Promise convention dicates you have a catch on every chain.
                console.log(err);
            });
    },
    OBS_Scenes() {
        obs.connect({
            address: config.default.obs_address,
            password: config.default.obs_pass
        })
            .then(() => {
                return obs.send(`GetSceneList`)
            })
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
            // .then(data => {
            //     result = obs.send('GetVolume', {
            //         source: source
            //     })
            // })
            // .then(
            //     console.log(result)
            // )
            // .catch(err => { // Promise convention dicates you have a catch on every chain.
            //     console.log(err);
            // });
            .then(console.log(obs.send('GetVolume', {
                source: source
            }))).catch(err);
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
    }
};