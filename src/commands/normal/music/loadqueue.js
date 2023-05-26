const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
	name: "loadqueue", //extras: commandOptions
	aliases: ["lq"],
	description: "wip", //loads a saved queue
	category: "music",
	run: async (client, message, args) => {
		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long

        
	},
};

