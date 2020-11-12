const TwitchClient = require('twitch').default;
const ChatClient = require('twitch-chat-client');
const fs = require('fs-extra');

(async () => {
    const clientId = '2tqdl2qsrdomqct2r0yoh4srygq5mz';
    const clientSecret = '3uu80t50kmxi5h9671qbxmfmpnfd12';
    const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
    const twitchClient = TwitchClient.withCredentials(clientId, tokenData.accessToken, undefined, {
        clientSecret,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({
            accessToken,
            refreshToken,
            expiryDate
        }) => {
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
            await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    });

    const chatClient = await ChatClient.forTwitchClient(twitchClient, {
        channels: ['cazgem']
    });
    await chatClient.connect();

    chatClient.onPrivmsg((channel, user, message) => {
        if (message === '!ping') {
            chatClient.say(channel, 'Pong!');
        } else if (message === '!dice') {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
        }
    });

    chatClient.onSub((channel, user) => {
        chatClient.say(channel, `Thanks to @${user} for subscribing to the channel!`);
    });
    chatClient.onResub((channel, user, subInfo) => {
        chatClient.say(channel, `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`);
    });
    chatClient.onSubGift((channel, user, subInfo) => {
        chatClient.say(channel, `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`);
    });
})();