module.exports = {
    name: 'sauce',
    aliases: ['saucelink'],
    description: "random number generator",
    run: (message, client, Discord, args, cmd)=>{
        max = 400000;
        // if (cmd === 'sauce'){
            message.channel.send(`${Math.floor(Math.random() * max)}`);
        // }
        
        if (cmd === 'saucelink'){
            if (message.channel.nsfw) {
                message.channel.send(`https://nhentai.net/g/${Math.floor(Math.random() * max)}/`);
            } else {
                message.channel.send("This channel is not NSFW.");
            }
            
            }
            try {
                message.reply({ content: 'dummy message', fetchReply: true })
                    .then((message) => message.delete())
            } catch (error) {console.log(error)}
    }
}