const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const { removeFavorite } = require("../../../functions/music/manageFavoritesFunction");
const { isNatural } = require("../../../functions/utilities");
module.exports = {
	name: "removefavorite", //extras: commandOptions
	aliases: [],
	options: [//optional
		{
			name: "songnumber",
			type: ApplicationCommandOptionType.Integer ,
			description: "removes a song from your favorites",
			required: true,
		},

	],
	description: "a normal command template",
	category: "template",
	run: async (client, message, args) => {

		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long
        if(! isNatural(args[0])) return Reply.editReply(message, "please provide a valid integer")
        content = await removeFavorite(message, args[0])
		Reply.editReply(message, content)
	},
};


