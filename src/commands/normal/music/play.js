const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");
const { play } = require("../../../functions/music/playFunction");
module.exports = {
	name: "play", //extras: commandOptions
	aliases: ["p"],
	options: [
		//optional
		{
			name: "query",
			type: ApplicationCommandOptionType.String,
			description: "Give the song name, url or playlist url",
			required: true,
		},
	],
	description: "Plays a song",
	category: "music",
	run: async (client, message, args) => {
		const voiceChannel = message.member?.voice?.channel;
		if (!voiceChannel) return Reply.send(message, { content: "You must join a voice channel first.", ephemeral: true });
		if (!args) return Reply.send(message, { content: "You must provide a song name or url.", ephemeral: true });
		await Reply.deferReply(message, false);
		play(client, message, args, voiceChannel);
	},
};
