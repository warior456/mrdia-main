const Reply = require("../../../structures/handlers/replyHandler");

module.exports = {
	name: "shuffle",
	aliases: [],
	description: "shuffles the queue",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, ephemeral: true });
		await Reply.deferReply(message, false); //only use if command can take long
		queue.shuffle();
		Reply.editReply(message, { content: "Shuffled Queue!" });
	},
};
