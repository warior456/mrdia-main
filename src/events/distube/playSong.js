const Reply = require("../../structures/handlers/replyHandler");

module.exports = {
	name: "playSong",
	isCustom: true,
	ignore: true, //disabled
	run: async (client) => {
		client.distube.on("playSong", (queue, song) =>
			Reply.follow(song.metadata.messageObject, `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}}`)
		);
	},
};
