const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
	name: "emoji", //extras: commandOptions
	aliases: [],
	options: [//optional
		{
			name: "name",
			type: ApplicationCommandOptionType.String ,
			description: "emoji name",
			required: true,
		},
		{
			name: "link",
			type: ApplicationCommandOptionType.String ,
			description: "image link",
			required: true,
		}//todo subcommands (not needed atm)
	],
	description: "add an emoji",
	category: "owner",
    ownerOnly: true,
	run: async (client, message, args) => {
		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long
        message.guild.emojis.create({ attachment: args[1], name: args[0] })
            .then(emoji => Reply.editReply(message, `Created new emoji with name ${emoji.name}!`))
            .catch(Reply.editReply(message, 'An error occured while adding the emoji!'));

    
	},
};

