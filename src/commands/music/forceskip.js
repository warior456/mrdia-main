module.exports = {
    name: 'forceskip',
    aliases: ['fskip', 'fs'],
    description: 'Force skips the current song',

    async execute(message, args, cmd, client, Discord) {
        let guildQueue = client.player.getQueue(message.guild.id);
        if(!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if(cmd === 'forceskip'||cmd === 'fskip'||cmd === 'fs') fskip(message, args, cmd, client, Discord, guildQueue);
    }
}


const fskip = async (message, args, cmd, client, Discord, guildQueue)=>{
    if(message.member.roles.cache.some(role => role.name === 'Dj')||message.author.id == process.env.OWNER||message.member.permissions.has("ADMINISTRATOR")){

        await guildQueue.skip();
        await message.channel.send(`Song skipped!`);
    } else {
        return message.channel.send(`You have to be a Dj or administrator!`);
    }
}