const { seekMessage, seekTo , validateTimestamp} = require("../../functions/music/seekFunction");
const Reply = require("../../structures/handlers/replyHandler")
const { MessageFlags } = require("discord.js");

module.exports = {
    name: 'rewind_30_sec',
    returnErrors: false, //commandOptions
    //ownerOnly: true,
    run: async (client, message) => {
        await Reply.deferUpdate(message) //Reply.follow to send messages and Reply.editReply to edit current message
        const queue = client.distube.getQueue(message);
        if (!queue) return Reply.follow(message, { content: `There is nothing playing right now!`, flags: MessageFlags.Ephemeral });
        timestamp = queue.currentTime - 30
        timestamp = validateTimestamp(queue, timestamp)
        await seekTo(queue, timestamp)//todo should probably properly fix this

        setTimeout(() => {
            Reply.editReply(message, { embeds: seekMessage(client, queue) });
        }, 2000);
    }
}