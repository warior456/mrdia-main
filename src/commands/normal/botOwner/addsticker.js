const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
	name: "sticker", //extras: commandOptions
	aliases: [],
	options: [//optional
		{
			name: "name",
			type: ApplicationCommandOptionType.String ,
			description: "sticker name",
			required: true,
		},
		{
			name: "link",
			type: ApplicationCommandOptionType.String ,
			description: "image link",
			required: true,
		},
		{
			name: "tag",
			type: ApplicationCommandOptionType.String ,
			description: "enter a tag for the sticker",
			required: true,
		}
	],
	description: "add a sticker",
	category: "owner",
    ownerOnly: true,
	run: async (client, message, args) => {
		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long
        message.guild.stickers.create({ file: args[1], name: args[0], tags: args[2] })
            .then(sticker => Reply.editReply(message, `Created new sticker with name ${sticker.name}!`))
            .catch(Reply.editReply(message, 'An error occured while adding the sticker!'));

    
	},
};

