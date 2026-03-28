const { default: Config } = require("../../../Config.js");
const CommandOptionsVerifier = require("../../structures/commandOptions/LoadCommandOptions");
const Guild = require("../../schemas/guild");

module.exports = {
	name: "messageCreate",
	run: async (message, DiscordClient) => {
		// Get guild custom prefix from database if available
		let guildPrefix = null;
		if (message.guild) {
			try {
				const guildProfile = await Guild.findOne({ guildId: message.guild.id });
				if (guildProfile && guildProfile.prefix) {
					guildPrefix = guildProfile.prefix;
				}
			} catch (error) {
				console.error("Error fetching guild prefix:", error);
			}
		}

		// Create prefix list: custom prefix (if exists) + config prefixes
		const prefixes = guildPrefix ? [guildPrefix, ...Config.prefix] : Config.prefix;

		for (const Prefix of prefixes) {
			if (!message.content.startsWith(Prefix)) continue;

			const CommandName = message.content.toString().toLowerCase().slice(Prefix.length).trim().split(" ")[0];
			const Command =
				DiscordClient.messageCommands.get(CommandName) ??
				DiscordClient.messageCommands.get(DiscordClient.messageCommands_Aliases.get(CommandName));
			if (!Command) continue;

			let args = message.content.slice(Prefix.length).trim();
			if (args.toLowerCase().startsWith(CommandName)) args = args.slice(CommandName.length).trim().split(" ");

			if (Command.limitUses && !isNaN(Command.limitUses)) {
				const limitUsesCollection = DiscordClient.limitCommandUses;
				let LimitedUsesCount = limitUsesCollection.get(`${Command.name}_MessageCommand`) ?? -1;
				limitUsesCollection.set(`${Command.name}_MessageCommand`, Math.floor(LimitedUsesCount + 1));
			}

			if (!CommandOptionsVerifier(DiscordClient, message, Command, false, "MessageCommand")) continue;

			if (Command.expireAfter && !isNaN(Command.expireAfter)) {
				const expireAfterCollection = DiscordClient.expireAfter;
				if (!expireAfterCollection.get(`${Command.name}_MessageCommand`))
					expireAfterCollection.set(`${Command.name}_MessageCommand`, Date.now());
			}

			if (Command.allowInDms) Command.run(DiscordClient, message, args);
			else if (!message.guild) return;
			else if (Command.allowBots) Command.run(DiscordClient, message, args);
			else if (message.author.bot) return;
			else Command.run(DiscordClient, message, args);

			return; // Command was found and executed
		}
	},
};
