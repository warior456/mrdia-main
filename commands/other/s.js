module.exports = {
    name: 'sauce',
    aliases: ['saucelink'],
    description: "random number generator",
    async execute(message, args, cmd, client, Discord){
        max = 382331;
        if (cmd === 'sauce'){
            message.channel.send(`${Math.floor(Math.random() * max)}`);
        }
        
        else if (cmd === 'saucelink'){
            if (message.channel.nsfw) {
                message.channel.send(`https://nhentai.net/g/${Math.floor(Math.random() * max)}/`);
            } else {
                message.channel.send("This channel is not NSFW.");
            }
            
            }
    }
}