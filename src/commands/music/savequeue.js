const Reply = require('../../Structures/Handlers/replyHandler')
const fs = require('fs');
const File = require('../../Utils/File');

module.exports = {
    name: 'savequeue',
    aliases: ['sq'],
    description: 'Saves the current queue with a given name',
    options: [{
        name: "name",
        type: "STRING",
        description: "Give the queue a name",
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd, player) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel) return Reply.send(message, 'Join a voice channel first!')

        save_queue(message, client, Discord, args, cmd, guildQueue);
    }
}
async function save_queue(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!args[0]) {
            return Reply.send(message, 'Please provide a name');
        }
        if (!guildQueue) {
            return Reply.send(message, `No song's in queue!`)
        }
        if  (!fs.existsSync(`./src/guildData`)){
            fs.mkdirSync(`./src/guidData`)
        }
        if (!fs.existsSync(`./guildData/${message.guild.id}`)) {
            fs.mkdirSync(`./guildData/${message.guild.id}`);
        }

        let savingQueue = ''
        for (var i = 0; i < guildQueue.songs.length; i++) {
            savingQueue += `${guildQueue.songs[i].url};${guildQueue.songs[i].requestedBy}\n`
        }

        await File.save(`./guildData/${message.guild.id}/${args[0]}.csv`, savingQueue, true);
        Reply.send(message, `**[${args[0]}]** has been saved!`)
    } catch (error) {
        console.log(error)
    }
}