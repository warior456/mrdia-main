const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");
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

async function play(client, message, args, voiceChannel) {
	await client.distube.play(voiceChannel, args.join(" "), {
		member: message.member,
		textChannel: message.channel,
		metadata: { messageObject: message, skipVotes: [], previousVotes: [] },
	});

	christmasSpecial(client, message, voiceChannel);
}

async function christmasSpecial(client, message, voiceChannel) {
	let max = 5;
	let random = Math.floor(Math.random() * max);

	if (random === 4) {
		const queue = await client.distube.getQueue(message);

		// one if five
		const date = new Date();
		if (date.getMonth() != 11 || date.getDate() != 25) return console.log("returned back from Christmas special"); //only on this date reason for this order is speed

		await client.distube.play(voiceChannel, "https://www.youtube.com/watch?v=g-OF7KGyDis", {
			member: message.member,
			textChannel: message.channel,
			metadata: { messageObject: message, skipVotes: [], previousVotes: [] },
		});

		if (!queue.songs[2]) {
			await queue.skip();
		}
	}
}
