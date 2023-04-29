const config = require("../../../Config");
const CommandOptionsVerifier = require("../../structures/commandOptions/LoadCommandOptions");
module.exports = {
	name: "messageCreate",
	run: async (message, DiscordClient) => {
		config.prefix.forEach((Prefix) => {
			if (!message.content.startsWith(Prefix)) return;
			const CommandName = message.content.toString().toLowerCase().slice(Prefix.length).trim().split(" ")[0];
			const Command =
				DiscordClient.messageCommands.get(CommandName) ??
				DiscordClient.messageCommands.get(DiscordClient.messageCommands_Aliases.get(CommandName));
			if (!Command) return;
			let args = message.content.slice(Prefix.length).trim();
			if (args.toLowerCase().startsWith(CommandName)) args = args.slice(CommandName.length).trim().split(" ");

			if (Command.limitUses && !isNaN(Command.limitUses)) {
				const limitUsesCollection = DiscordClient.limitCommandUses;
				let LimitedUsesCount = limitUsesCollection.get(`${Command.name}_MessageCommand`) ?? -1;
				limitUsesCollection.set(`${Command.name}_MessageCommand`, Math.floor(LimitedUsesCount + 1));
			}

			if (!CommandOptionsVerifier(DiscordClient, message, Command, false, "MessageCommand")) return;

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
		});
	},
};
