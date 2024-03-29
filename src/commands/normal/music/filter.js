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
				{ name: "subboost", value: "subboost" },
				{ name: "nightcore", value: "nightcore" },
				{ name: "vaporwave", value: "vaporwave" },
				{ name: "surround", value: "surround" },
				{ name: "3d", value: "3d" },
				{ name: "echo", value: "echo" },
				{ name: "haas", value: "haas" },
				{ name: "phaser", value: "phaser" },
				{ name: "flanger", value: "flanger" },
				{ name: "gate", value: "gate" },
				{ name: "mcompand", value: "mcompand" },
				{ name: "tremolo", value: "tremolo" },
				{ name: "reverse", value: "reverse" },
			],
		},
	],
	description: "Enable or disable filters",
	category: "template",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: "There is no song playing right now!", ephemeral: true });
		content = await toggleFilter(args, queue);
		await Reply.send(message, content);
	},
};
async function toggleFilter(args, queue) {
	if (args[0] === "clear") {
		queue.filters.clear();
		return "Disabled all filters";
	}
	if (queue.filters.names.includes(args.join(" "))) {
		await queue.filters.remove(args.join(" "));
		return `Disabled:  ${args[0]}`;
	}
	await queue.filters.add(args.join(" "));
	// 	.catch((error) => {
	// 	return "Unknown or invalid filter";
	// });
	return `Enabled: ${args[0]}`;
}
