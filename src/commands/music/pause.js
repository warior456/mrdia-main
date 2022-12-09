const Reply = require('../../Structures/Handlers/replyHandler')
//todo options
module.exports = {
    name: 'pause',
    aliases: ['resume'],
    description: 'pause the current song',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        return Reply.send(message, { content: 'This command is disabled due to multiple issues', ephemeral: true })

        // if (cmd === 'pause') pause(message, client, Discord, args, cmd, guildQueue);

        // else if (cmd === 'resume') resume(message, client, Discord, args, cmd, guildQueue);
    }
}

// function pause(message, client, Discord, args, cmd, guildQueue) {
//     try {
//         guildQueue.setPaused(true);
//     } catch (error) {
//         Reply.send(message, `Something went wrong when trying to pause the song!`);
//     }

// }

// function resume(message, client, Discord, args, cmd, guildQueue) {
//     try {
//         guildQueue.setPaused(false);
//     } catch (error) {
//         Reply.send(message, `Something went wrong when trying to resume the song!`);
//     }
// }