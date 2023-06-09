const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
module.exports = {
	name: "help", //extras: commandOptions
	aliases: ["?"],
	options: [
		//optional
		{
			name: "type",
			type: ApplicationCommandOptionType.String,
			description: "Choose what you need help with",
			required: true,
			choices: [
				{ name: "Other commands", value: "other" },
				{ name: "Music commands", value: "music" },
			], //optional
		},
	],
	description: "Help message",
	category: "other",
	run: (client, message, args) => {
		if (!args[0]) args[0] = "other";
		help(message, client, args[0]);
	},
};

function help(message, client, option) {
	const helpEmbed = new EmbedBuilder()
		.setColor(client.config.otherCommandColor)
		.setTitle(`**My prefix is: ${client.config.prefix}**`)
		.setDescription(helpMsg(client, option));

	Reply.send(message, { embeds: [helpEmbed] });
}

function helpMsg(client, option) {
	let help_msg = "";
	client.messageCommands.forEach((cmd) => {
		if (cmd.category != option) return;
		if (cmd.noHelp) return;
		help_msg += `**${client.config.prefix}${cmd.name}** | Aliases: [${cmd.aliases}]\nOptions: [${cmdOptions(cmd)}]\n ${cmd.description}\n\n`;
	});
	return help_msg;
}

function cmdOptions(cmd) {
	let cmdOptionFormatted = [];

	if (!cmd.options) return cmdOptionFormatted;
	if (!cmd.options[0].choices) {
		for (let index = 0; index < cmd.options.length; index++) {
			//returns the type of answer if it's not with choices
			cmdOptionFormatted.push(cmdOptionTypeToString(cmd.options[index].type));
		}
		return cmdOptionFormatted;
	}

	for (let index = 0; index < cmd.options.length; index++) {
		for (let i = 0; i < cmd.options[index].choices.length; i++) {
			cmdOptionFormatted.push(cmd.options[index].choices[i].value);
		}
	}

	return cmdOptionFormatted;
}

function cmdOptionTypeToString(arg) {
	switch (arg) {
		case ApplicationCommandOptionType.Attachment:
			return "attachment";
		case ApplicationCommandOptionType.Channel:
			return "channel";
		case ApplicationCommandOptionType.Mentionable:
			return "mentionable";
		case ApplicationCommandOptionType.Boolean:
			return "boolean";
		case ApplicationCommandOptionType.Integer:
			return "interger";
		case ApplicationCommandOptionType.Number:
			return "number";
		case ApplicationCommandOptionType.Role:
			return "role";
		case ApplicationCommandOptionType.String:
			return "string";
		case ApplicationCommandOptionType.Subcommand:
			return "subcommand"; // can be worked out to expand later
		case ApplicationCommandOptionType.SubcommandGroup:
			return "subcommandgroup";
		case ApplicationCommandOptionType.User:
			return "user";
		default:
			break;
	}
}

function addButtons() {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("previous_help").setLabel("Previous page").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("next_help").setLabel("Next page").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("end").setLabel("End interaction").setStyle(ButtonStyle.Danger)
	);
	return [row];
}
