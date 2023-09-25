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
			description: "give a server id",
			required: false,
		},
		{
			name: "legacy",
			type: ApplicationCommandOptionType.Boolean ,
			description: "load a legacy queue",
			required: false,
		},

	],
	category: "music",
	run: async (client, message, args) => {
		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long
		queueName = args[0]
		if(!args[1]) args[1] = message.guild.id
		serverId = args[1]
		if(!args[2]) args[2] = false
		legacy = args[2]
		loadQueue(queueName, serverId, legacy, client, message, args)
        
	},
};

