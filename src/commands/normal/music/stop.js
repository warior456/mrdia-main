const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
	name: "stop",
	aliases: ["leave"],
	description: "Stop the queue",
	category: "music",
	run: (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, ephemeral: true });
		queue.stop().then(Reply.send(message, { content: `Stopped the queue!` }));
	},
};
