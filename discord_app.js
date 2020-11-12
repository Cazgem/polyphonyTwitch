const config = require('./server/irc/config.js');
const discord = require('discord.js');
const client = new discord.Client();
const chalk = require('chalk');

client.on('ready', () => {
    console.log(chalk.yellow('I am ready for Discord!'));
});
client.login(config.discord.token);
// discord.on('message', msg => {
//     let params = msg.content.slice(1).split(' ');
//     // The first parameter can be removed and lowercased for the command name
//     let cname = params.shift().toLowerCase();
//     if (msg[0] !== '!') {
//         return;
//     }
//     if (msg.content === '!ping') {
//         msg.channel.send('Pong.');
//     } else if (msg.content === `!role`) {
//         let role = discord.guild.roles.find('name', 'Minecraft');
//         // let member = msg.mentions.members.first();
//         // member.roles.add(role);
//         msg.channel.send(role);
//     } else {
//         try { // Search MySQL DB for command (good for simple commands. Use !polyphony add/edit <text> to add/edit commands
//             var chan = 'cazgem';
//             let sql = `SELECT response FROM commands WHERE channel = ? AND command = ?`;
//             let response = db.query(sql, [chan, cname], (err, result) => {
//                 Object.keys(result).forEach(function (key) {
//                     msg.channel.send(result[key].response);
//                 });
//                 if (err) throw err;
//             });
//         } catch (err) {
//             console.log(chalk.red("ERROR! No Command Found"));
//         }
//     }
// });