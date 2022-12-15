const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");
module.exports = {
	name: "play", //extras: commandOptions
	aliases: ["p"],
	options: [
		//optional
		{
			name: "song",
			type: ApplicationCommandOptionType.String,
			description: "Give the song name or url",
			required: true,
		},
	],
	description: "Plays a song",
	category: "music",
	run: async (client, message, args) => {
		const voiceChannel = message.member?.voice?.channel;
		if (!voiceChannel) return Reply.send(message, { content: "You must join a voice channel first.", ephemeral: true });
		await Reply.deferReply(message, false);
		play(client, message, args, voiceChannel);
	},
};

async function play(client, message, args, voiceChannel) {
	Interaction = message;
	song = await client.distube.play(voiceChannel, args.join(" "), {
		member: message.member,
		textChannel: message.channel,
		metadata: { messageObject: message, skipVotes: [] },
	});
}
