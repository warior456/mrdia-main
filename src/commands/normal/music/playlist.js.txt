const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "playlist", //extras: commandOptions
	aliases: ["pl"],
	options: [
		//optional
		{
			name: "url",
			type: ApplicationCommandOptionType.String,
			description: "Provide a playlist url or name",
			required: true,
		},
	],
	description: "Play a playlist from Youtube, Spotify or other platforms.",
	category: "music",
	run: async (client, message, args) => {
		const voiceChannel = message.member?.voice?.channel;
		if (!voiceChannel) return Reply.send(message, { content: "You must join a voice channel first.", ephemeral: true });
		if (!args) return Reply.send(message, { content: "You must provide a playlist url or name.", ephemeral: true });
		await Reply.deferReply(message, false);

		playlist = await createPlaylist(client, message, args);
		await play(client, message, playlist, voiceChannel);
	},
};

async function createPlaylist(client, message, args) {
	return await client.distube.handler.resolve(args.join(" "))
}

async function play(client, message, playlist, voiceChannel) {
	await client.distube.play(voiceChannel, playlist, {
		member: message.member,
		textChannel: message.channel,
		metadata: { messageObject: message, skipVotes: [] },
	});
}
