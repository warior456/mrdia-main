const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { migrateAllGuildQueues, migrateSingleQueue } = require("../../../functions/music/migrateQueuesFunction");

module.exports = {
	name: "migratequeues",
	aliases: ["mq"],
	description: "Migrate legacy CSV queues to MongoDB (Owner only)",
	category: "owner",
	ownerOnly: true,
	ignoreSlash: true,
	options: [
		{
			name: "mode",
			type: ApplicationCommandOptionType.String,
			description: "Migration mode: 'all' to migrate all queues, 'single' for one queue",
			required: true,
			choices: [
				{ name: "all", value: "all" },
				{ name: "single", value: "single" },
			],
		},
		{
			name: "queue",
			type: ApplicationCommandOptionType.String,
			description: "Queue name (only for single mode)",
			required: false,
		},
		{
			name: "guildid",
			type: ApplicationCommandOptionType.String,
			description: "Guild ID to migrate from (defaults to current guild)",
			required: false,
		},
	],
	run: async (client, message, args) => {
		try {
			await Reply.deferReply(message, false);

			const mode = args[0];
			const queueName = args[1] || null;
			const guildId = args[2] || message.guild.id;

			let results;

			if (mode === "single") {
				if (!queueName) {
					return Reply.editReply(message, {
						content: "Please specify a queue name for single migration",
						ephemeral: true,
					});
				}

				const result = await migrateSingleQueue(guildId, queueName, message.member.user.id, message.member.user.username);
				results = [result];
			} else if (mode === "all") {
				results = await migrateAllGuildQueues(guildId, {
					userId: message.member.user.id,
					userName: message.member.user.username,
				});
			} else {
				return Reply.editReply(message, {
					content: "Invalid mode. Use 'all' or 'single'",
					ephemeral: true,
				});
			}

			// Format results
			const embed = new EmbedBuilder()
				.setTitle("Queue Migration Results")
				.setColor(client.config.musicCommandColor)
				.setTimestamp();

			let successCount = 0;
			let errorCount = 0;
			let description = "";

			for (const result of results) {
				if (result.success) {
					successCount++;
					description += `✅ ${result.file || result.message} (${result.songsCount} songs)\n`;
				} else {
					errorCount++;
					description += `❌ ${result.file ? result.file + ": " : ""}${result.error}\n`;
				}
			}

			embed.setDescription(description || "No results");
			embed.addFields(
				{ name: "Successful", value: `${successCount}`, inline: true },
				{ name: "Failed", value: `${errorCount}`, inline: true }
			);

			Reply.editReply(message, { embeds: [embed] });
		} catch (error) {
			console.error(error);
			Reply.editReply(message, {
				content: "An error occurred during migration",
				ephemeral: true,
			});
		}
	},
};
