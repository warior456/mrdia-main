const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'sauce',
    aliases: ['saucelink'],
    description: "random number generator",
    options: [{
        name: "type",
        type: "STRING",
        description: "number, link",
        choices: [{ name: 'number', value: 'number' }, { name: 'link', value: 'link' }],
        required: true
    }],
    category: 'other',
    run: (message, client, Discord, args, cmd) => {
        
        let option = args[0]
        max = 429554;
        if (option === 'number'|| !args[0]) sauce(message, max)
        if (option === 'link') saucelink(message, max)
        if (cmd === 'saucelink') {
        }
    }
}

function sauce(message ,max) {
    Reply.send(message, `${Math.floor(Math.random() * max)}`);
}

function saucelink(message, max) {
    if (message.channel.nsfw) {
        Reply.send(message, `https://nhentai.net/g/${Math.floor(Math.random() * max)}/`);
    } else {
        Reply.send(message, "This channel is not NSFW.");
    }
}