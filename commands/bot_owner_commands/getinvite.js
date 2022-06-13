module.exports = {
    name: 'ginvite',
    description: "pong!",
    execute(message, args, cmd, client, Discord){
        if(message.author.id != process.env.OWNER) return message.channel.send(`I don't think this is for you!`)
        
            client.guilds.cache.forEach(guild => {
                message.channel.createInvite({ unique: true, temporary: false }).then(invite => {
                    console.log(invite.code);
                });
                
            })
        
        
    }
}