const Reply = require("../../structures/handlers/replyHandler");

module.exports = {
	name: "addSong",
	isCustom: true,
	run: (client) => {
		client.distube.on("addSong", (queue, song) =>
			addSongReply(queue, song)
		);
	},
};
async function addSongReply(queue, song) {
	if(song.url == "https://www.youtube.com/watch?v=g-OF7KGyDis") return 
	await Reply.editReply(song.metadata.messageObject, `Added **${song.name}** - \`${song.formattedDuration}\` to the queue by ${song.user}`)
	delete song.metadata.messageObject //ram optimize?
}