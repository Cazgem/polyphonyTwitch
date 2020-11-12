exports.run = (client, msg, params, context, channel, polyphony) => {
    if (msg.slice(6)) {
        client.action(channel, `Here's your ${msg.slice(6)}, ${context["display-name"]}! Anything else?`);
    }
}
// function parse(str) {
//     var args = [].slice.call(arguments, 1),
//         i = 0;

//     return str.replace(/%s7/g, () => args[i++]);
// }
// console.log(parse('hello %s7, how are you doing', msg.slice(6)))