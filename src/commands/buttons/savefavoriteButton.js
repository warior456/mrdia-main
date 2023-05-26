const { saveFavorite } = require("../../functions/music/manageFavoritesFunction");
const Reply = require("../../structures/handlers/replyHandler")

module.exports = {
    name : 'savefavorite',
    returnErrors: false, //commandOptions
    run : async(client, message) => {
        await Reply.deferUpdate(message) //Reply.follow to send messages and Reply.editReply to edit current message
        const queue = client.distube.getQueue(message);
        if(!queue) return Reply.follow(message,{ content: 'There is nothing playing right now!', ephemeral: true })
        song = queue.songs[0]
        content = await saveFavorite(message, song)
        Reply.follow(message, content)
    }
}