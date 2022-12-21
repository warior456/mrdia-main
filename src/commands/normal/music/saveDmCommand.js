const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const { saveDm, saveDmButton } = require("../../../functions/music/saveDmFunction");

module.exports = {
	name: "savedm", //extras: commandOptions
	aliases: ["yoink"],
	description: "Sends the current song to your dm",
	category: "music",
	run: async (client, message, args) => {
        await Reply.deferReply(message, true)
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.editReply(message, { content: "There is no song playing right now!", ephemeral: true });
		Reply.dm(message, { embeds: saveDm(client, queue, message), components: saveDmButton() });
	},
};
