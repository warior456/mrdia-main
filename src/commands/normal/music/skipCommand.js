const Reply = require("../../../structures/handlers/replyHandler");
const { skipSong } = require("../../../functions/music/skipFunction");

module.exports = {
	name: "skip", //extras: commandOptions
	aliases: ['s'],
	description: "Skips the current song (with voting)",
	category: "music",
	run: async (client, message, args) => {
		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long
        const queue = client.distube.getQueue(message);
        if(!queue) return Reply.editReply(message, {content: 'There is nothing in the queue right now!', ephemeral: true})
        content = await skipSong(message.member.user.id, queue, message)
        Reply.editReply(message, content)
	},
};