const Reply = require("../../structures/handlers/replyHandler")
const { nowPlaying } = require("../../functions/music/nowPlayingFunction");

module.exports = {
    name : 'refresh_np',
    returnErrors: false, //commandOptions
    //ownerOnly: true,
    run : async(client, message) => {
        await Reply.deferUpdate(message) //Reply.follow to send messages and Reply.editReply to edit current message
        const queue = client.distube.getQueue(message);
		if (!queue) return Reply.follow(message, {content: `There is nothing playing right now!`, ephemeral: true});
        Reply.editReply(message, {embeds: nowPlaying(client, queue)})
    }
}