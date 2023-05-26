const { loadFavorites } = require("../../functions/music/loadFavoritesFunction")
const Reply = require("../../structures/handlers/replyHandler")

module.exports = {
    name : 'load_favorites',
    returnErrors: false,
    run : async(client, message) => {
        requesteduserid = message.message.embeds[0].footer.text
        const voiceChannel = message.member?.voice?.channel;
		if (!voiceChannel) return Reply.send(message, { content: "You must join a voice channel first.", ephemeral: true });
		Reply.send(message, `loading favorites of <@${requesteduserid}> ...`)


        
		content = await loadFavorites(client, message, requesteduserid, voiceChannel);
        Reply.editReply(message, content)
    }
}