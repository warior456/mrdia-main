const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");
const { loadQueue } = require("../../../functions/music/loadQueueFunction");

module.exports = {
	name: "loadqueue",
	aliases: ["lq"],
	description: "Loads a saved queue (from database or legacy CSV)",
	options: [
		{
			name: "name",
			type: ApplicationCommandOptionType.String,
			description: "Queue name to load",
			required: true,
		},
		{
			name: "serverid",
			type: ApplicationCommandOptionType.String,
			description: "Server ID to load from (optional, defaults to current server)",
			required: false,
		},
		{
			name: "legacy",
			type: ApplicationCommandOptionType.Boolean,
			description: "Load from legacy CSV instead of database (for migration)",
			required: false,
		},
	],
	category: "music",
	run: async (client, message, args) => {
		if (!args[0]) {
			return Reply.send(message, { content: "Error: no queue name provided", ephemeral: true });
		}

		await Reply.deferReply(message, false);
		
		// Build args array: [queueName, serverId, legacy]
		const queueName = args[0];
		const serverId = args[1] || message.guild.id;
		const legacy = args[2] === "true" || args[2] === true ? true : false;

		loadQueue(queueName, client, message, [queueName, serverId, legacy]);
	},
};


