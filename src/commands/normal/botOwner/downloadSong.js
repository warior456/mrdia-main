const Reply = require("../../../structures/handlers/replyHandler");

module.exports = {
	name: "download",
	aliases: [],
	description: "A link where you can download the currently playing song",
	category: "owner",
	ownerOnly: true,
	ignoreSlash: false,
	run: (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, ephemeral: true });
		Reply.send(message, { content: `Download: ${queue.songs[0].streamURL}`, ephemeral: true });
	},
};
