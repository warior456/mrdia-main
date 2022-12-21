const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "filter", //extras: commandOptions
	aliases: [],
	options: [
		//optional
		{
			name: "filter",
			type: ApplicationCommandOptionType.String,
			description: "The filter you want to apply",
			required: true,
			choices: [
				{ name: "clear", value: "clear" },
				{ name: "bassboost", value: "bassboost" },
				{ name: "nightcore", value: "nightcore" },
				{ name: "vaporwave", value: "vaporwave" },
				{ name: "haas", value: "haas" },
				{ name: "phaser", value: "phaser" },
				{ name: "3d", value: "3d" },
				{ name: "echo", value: "echo" },
				{ name: "surround", value: "surround" },
			],
		},
	],
	description: "Enable or disable filters",
	category: "template",
	run: async (client, message, args) => {
		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.editReply(message, { content: "There is no song playing right now!", ephemeral: true });

		Reply.editReply(message, setFilter(args, queue));
	},
};
function setFilter(args, queue) {
	if (args[0] === "clear") {
		queue.filters.clear();
		return "Disabled all filters";
	}
	queue.filters.add(args[0]);
	return `Enabled: ${args[0]}`;
}
