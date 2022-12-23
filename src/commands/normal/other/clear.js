const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");

module.exports = {
	name: "clear", //extras: commandOptions
	aliases: [],
	options: [
		//optional
		{
			name: "amount",
			type: ApplicationCommandOptionType.Integer,
			description: "Give the amount of messages to clear (max 100)",
			required: true,
		},
	],
	description: "clear messages!",
	category: "other",
	run: async (client, message, args) => {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !message.member.user.id === client.config.owner) {
			return Reply.send(message, { content: "I don't think this is for you!", ephemeral: true });
		}

		if (!args[0]) return Reply.send(message, { content: `usage: ${process.env.PREFIX}clear [amount 1-100]`, ephemeral: true });
		if (isNaN(args[0])) return Reply.send(message, { content: "That is not a number!", ephemeral: true });
		if (args[0] > 100) return Reply.send(message, { content: "you can't delete more than 100 messages", ephemeral: true });
		if (args[0] < 1) return Reply.send(message, { content: "You must delete at least 1 message", ephemeral: true });

		await message.channel.messages.fetch({ limit: args[0] }).then((messages) => {
			message.channel.bulkDelete(messages);
			Reply.send(message, { content: `Removed ${args[0]} messages!`, ephemeral: true }); //bug this even shows when failed
		});
	},
};
