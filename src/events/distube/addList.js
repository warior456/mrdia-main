
const Reply = require("../../structures/handlers/replyHandler");

module.exports = {
	name: "addList",
	isCustom: true,
	run: async (client) => {
		client.distube.on("addList", async (queue, playlist) => {
			if (playlist.metadata?.ignoremessage === true) return;
			const messageObject = playlist.metadata?.messageObject || queue.songs[0]?.metadata?.messageObject;
			if (messageObject) {
				await Reply.editReply(
					messageObject,
					`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs to queue)`
				);
			}
			if (playlist.metadata) {
				delete playlist.metadata.messageObject;
				delete playlist.metadata.ignoremessage; //ram optimize?
			}
		});
	},
};
