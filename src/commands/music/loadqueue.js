const fs = require('fs');
const File = require('../../Utils/File');
const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'loadqueue',
    aliases: ['loq'],
    description: 'Loads a queue that has been saved',
    options: [{
        name: "name",
        type: "STRING",
        description: "Give the queue name",
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd, player) => {
        if (!message.member.voice.channel) return Reply.Reply(message, { content: 'Join a voice channel first!', ephemeral: true })
        await Reply.defer(message, false)
        let guildQueue = client.player.getQueue(message.guild.id);
        loadQueue(message, client, Discord, args, cmd, guildQueue);
    }
}
async function loadQueue(message, client, Discord, args, cmd, guildQueue) {

    try {
        if (!args[0]) {
            return Reply.send(message, 'Please provide a name');
        }
        if (!fs.existsSync(`./src/guildData`)) {
            fs.mkdirSync(`./src/guidData`)
        }
        if (!fs.existsSync(`./src/guildData/${message.guild.id}`)) {
            fs.mkdirSync(`./src/guildData/${message.guild.id}`);
        }
        if (!fs.existsSync(`./src/guildData/${message.guild.id}/${args[0]}.csv`)) {
            return Reply.send(message, { content: `Error- That queue doesn't exist!`, ephemeral: true })
        }
        if (!message.member.voice.channel) {
            return Reply.send(message, { content: 'Error- Join a voice channel first!', ephemeral: true })
        }

        try {
            Reply.send(message, 'loading queue')

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
                // Reply.send(errorMessage)
                Reply.follow(message, `**[${args[0]}]** has been  loaded`)
            } catch (error) {
                console.log(error);
                Reply.follow(message, `something went wrong while loading the queue`);
            }

        } catch (error) {
            console.log(error)
            Reply.follow(message, 'unable to load queue')
        }



    } catch (error) {
        console.log(error)
    }
}