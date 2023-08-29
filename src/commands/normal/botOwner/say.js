const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
	name: "say", //extras: commandOptions
	aliases: [],
	options: [//optional
		{
			name: "content",
			type: ApplicationCommandOptionType.String ,
			description: "content to send",
			required: true,
		},
		{
			name: "channelid",
			type: ApplicationCommandOptionType.String ,
			description: "channel to send the message",
			required: false,
        }

	],
	description: "say something (perms wip)",
	category: "owner",
    ownerOnly: true,
	run: async (client, message, args) => {
		//async only if deferring
        if(!args[1]){Reply.send(message, args[0])}
		client.channels.cache.get(args[1]).send(args[0]).then(sentMessage => {
        	//sentMessage.delete(2000);
        });
	},
};
