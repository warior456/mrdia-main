const fs = require('fs');
const File = require('../../Utils/File');

module.exports = {
    name: 'loadqueue',
    aliases: ['loq'],
    description: 'Loads a queue that has been saved',
    run: async (message, client, Discord, args, cmd, player) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('Join a voice channel first!')

        if (cmd === 'loq' || cmd === 'loadqueue') loadqueue(message, client, Discord, args, cmd, guildQueue);
    }
}
async function loadqueue(message, client, Discord, args, cmd, guildQueue) {

    try {
        if (!args[0]) {
            return message.channel.send('Please provide a name');
        }
        if (!guildQueue) {
            let guildQueue = client.player.getQueue(message.guild.id);
        }
        if (!fs.existsSync(`./src/guildData/${message.guild.id}`)) {
            fs.mkdirSync(`./src/guildData/${message.guild.id}`);
        }
        if (!fs.existsSync(`./src/guildData/${message.guild.id}/${args[0]}.csv`)) {
            return message.channel.send(`that queue doesn't exist`)
        }
        if (!message.member.voice.channel) {
            return message.channel.send('join a voice channel first!')
        }
        try {
            message.channel.send('loading queue')

            try {
                const loQueue = await File.read(`./src/guildData/${message.guild.id}/${args[0]}.csv`);

                let queue = client.player.createQueue(message.guild.id);
                await queue.join(message.member.voice.channel);
                let loSongs = await loQueue.split(/\n|;/g).filter(s => s)
                for (var i = 0; i < loSongs.length - 1; i = i + 2) {
                    try {
                        await queue.play(loSongs[i], {
                            requestedBy: loSongs[i + 1],
                            data: {
                                skipVotes: []
                            }
                        });
                    } catch (error) {
                        console.log(error)
                    }

                }
                // message.channel.send(errorMessage)
                message.channel.send(`**[${args[0]}]** has been  loaded`)
            } catch (error) {
                console.log(error);
                message.channel.send(`something went wrong while loading the queue`);
            }

        } catch (error) {
            console.log(error)
            message.channel.send('unable to load queue')
        }



    } catch (error) {
        console.log(error)
    }
}