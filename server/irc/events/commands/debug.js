exports.run = (client, message, params, context, channel, polyphony) => {
    if (context['display-name'] === 'Cazgem') {
        console.log(escape(message))
        // function parse(str) {
        //     var args = [].slice.call(arguments, 1),
        //         i = 0;
        //     return str.replace(`\${user}`, () => args[i++]);
        // }
        // console.log(parse('hello ${user}, how are you doing', msg))
    }
}