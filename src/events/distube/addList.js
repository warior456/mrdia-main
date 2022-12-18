const Reply = require("../../structures/handlers/replyHandler");

module.exports = {
	name: "addList",
	isCustom: true,
	run: async (client) => {
		client.distube.on("addList", (queue, playlist) =>
			Reply.editReply(queue.songs[0].metadata.messageObject, `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs to queue)`)
		);
	},
};
