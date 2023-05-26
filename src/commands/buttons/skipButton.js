const Reply = require("../../structures/handlers/replyHandler")
const { skipSong } = require('../../functions/music/skipFunction')

module.exports = {
    name : 'skip',
    returnErrors: false, //commandOptions
    run : async(client, message) => {
        await Reply.deferUpdate(message) //Reply.follow to send messages and Reply.editReply to edit current message
        const queue = client.distube.getQueue(message);
        if(!queue) return Reply.follow(message, {content: 'There is nothing in the queue right now!', ephemeral: true})
        content = await skipSong(message.member.user.id, queue, message, client)
        Reply.follow(message, content)
        
    }
}