const { parseNumber } = require("distube");
const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
module.exports = {
	name: "volume",
	aliases: ["setvolume", "sv"],
	description: "sets the volume of the bot",
	options: [
		{
			name: "volume",
			type: ApplicationCommandOptionType.Number,
			description: "give a value between 1-300 (or for Dj's it can be higher)",
			required: true,
		},
	],
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, ephemeral: true });

		//if (args[0] == 'default' || args[0] == 'reset') args[0] = 50
		content = await setVolume(message, client, args, queue);
		Reply.send(message, content);
	},
};

async function setVolume(message, client, args, queue) {
	try {
		if (
			message.member.roles.cache.some((role) => role.name === "Dj") ||
			message.member.user.id == client.config.owner ||
			message.member.permissions.has(PermissionsBitField.Flags.Administrator)
		) {
			await queue.setVolume(parseNumber(args[0]));
			return `Volume set to ${args[0]}`;
		} else if (args[0] <= 150) {
			await queue.setVolume(parseNumber(args[0]));
			return `Volume set to ${args[0]}`;
		} else {
			return `You need [Dj] role to set the volume above 150`;
		}
	} catch (error) {
		console.log(error);
        return `an error occured`
	}
}
