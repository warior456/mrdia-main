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
        max = 418554;
        if (option == 'number') sauce(max)
        if (option == 'link') saucelink(max)
        if (cmd === 'saucelink') {
        }
    }
}

function sauce(max) {
    Reply.send(message, `${Math.floor(Math.random() * max)}`);
}

function saucelink(max) {
    if (message.channel.nsfw) {
        Reply.send(message, `https://nhentai.net/g/${Math.floor(Math.random() * max)}/`);
    } else {
        Reply.send(message, "This channel is not NSFW.");
    }
}