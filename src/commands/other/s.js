const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'sauce',
    aliases: ['saucelink'],
    description: "random number generator",
    category: 'other',
    run: (message, client, Discord, args, cmd)=>{
        max = 400000;
        // if (cmd === 'sauce'){
            Reply.send(message, `${Math.floor(Math.random() * max)}`);
        // }
        
        if (cmd === 'saucelink'){
            if (message.channel.nsfw) {
                Reply.send(message, `https://nhentai.net/g/${Math.floor(Math.random() * max)}/`);
            } else {
                Reply.send(message, "This channel is not NSFW.");
            }
            
            }
            // try {
            //     message.reply({ content: 'dummy message', fetchReply: true })
            //         .then((message) => message.delete())
            // } catch (error) {console.log(error)}
    }
}