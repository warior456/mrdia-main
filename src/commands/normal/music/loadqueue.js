const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const {loadQueue} = require("../../../functions/music/loadQueueFunction")
module.exports = {
	name: "loadqueue", //extras: commandOptions
	aliases: ["lq"],
	description: "wip", //loads a saved queue
	options: [
		{
			name: "name",
			type: ApplicationCommandOptionType.String ,
			description: "queue name",
			required: true,
		},
		{
			name: "serverid",
			type: ApplicationCommandOptionType.Integer ,
			description: "give a server id (optional)",
			required: false,
		},
		{
			name: "legacy",
			type: ApplicationCommandOptionType.Boolean ,
			description: "load a legacy queue (optional)",
			required: false,
		},

	],
	category: "music",
	run: async (client, message, args) => {
		if(args[0]) Reply.send(message, `Error- no name provided`)
		if(message.options._hoistedOptions != null) {
			//todo
			await Reply.deferReply(message, false);
		}else{
			await Reply.deferReply(message, false); //only use if command can take long

			loadQueue(queueName, client, message, args)
		}
		//async only if deferring
		
        
	},
};

