
const Reply = require("../../structures/handlers/replyHandler");

module.exports = {
	name: "addList",
	isCustom: true,
	run: async (client) => {
		client.distube.on("addList", (queue, playlist) => {
			if (playlist.metadata.ignoremessage == true) return;
			Reply.editReply(queue.songs[0].metadata.messageObject, `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs to queue)`); //bugged
			delete playlist.metadata.messageObject
			delete playlist.metadata.ignoremessage //ram optimize?
		});
	},
};
