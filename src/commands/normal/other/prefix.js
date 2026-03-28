const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const Guild = require("../../../schemas/guild");
const mongoose = require("mongoose");

module.exports = {
	name: "prefix",
	aliases: [],
	options: [
		{
			name: "newprefix",
			type: ApplicationCommandOptionType.String,
			description: "The new prefix for this server",
			required: false,
		},
	],
	description: "Set or view custom prefix for this server",
	category: "other",
	noHelp: true,
	run: async (client, message, args) => {
		try {
			// Find or create guild profile
			let guildProfile = await Guild.findOne({ guildId: message.guild.id });

			if (!guildProfile) {
				// Create new guild profile
				guildProfile = await new Guild({
					_id: new mongoose.Types.ObjectId(),
					guildId: message.guild.id,
					guildName: message.guild.name,
					guildIcon: message.guild.iconURL() || "None",
					prefix: null,
				});
				await guildProfile.save().catch(console.error);
			}

			// If no new prefix provided, show current prefix
			if (!args[0]) {
				const currentPrefix = guildProfile.prefix || client.config.prefix[0];
				return Reply.send(message, {
					content: `Current prefix: \`${currentPrefix}\``,
					ephemeral: true,
				});
			}

			if (!message.member?.permissions?.has(PermissionFlagsBits.ManageGuild)) {
				return Reply.send(message, {
					content: "You need the Manage Server permission to change the prefix.",
					ephemeral: true,
				});
			}

			const newPrefix = args[0];

			// Validate prefix length
			if (newPrefix.length > 10) {
				return Reply.send(message, {
					content: "Prefix must be 10 characters or less!",
					ephemeral: true,
				});
			}

			// Update prefix in database
			guildProfile.prefix = newPrefix;
			await guildProfile.save().catch(console.error);

			Reply.send(message, {
				content: `Prefix has been set to: \`${newPrefix}\``,
				ephemeral: true,
			});
		} catch (error) {
			console.error(error);
			Reply.send(message, {
				content: "An error occurred while setting the prefix",
				ephemeral: true,
			});
		}
	},
};
