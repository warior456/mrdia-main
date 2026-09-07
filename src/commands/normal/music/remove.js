const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "remove",
	aliases: ["removesong"],
	options: [
		{
			name: "songnumber",
			type: ApplicationCommandOptionType.Integer,
			description: "The position number of the song to remove from the queue",
			required: true,
		},
	],
	description: "Removes a song from the queue by its position number",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);

		if (!message.member?.voice?.channel && message.member?.user?.id !== client.config.owner) {
			return Reply.send(message, { content: "Join a voice channel first!", ephemeral: true });
		}

		if (!queue || queue.songs.length <= 1) {
			return Reply.send(message, { content: "There are no upcoming songs in the queue to remove!", ephemeral: true });
		}

		const songIndex = parseInt(args[0]);

		if (isNaN(songIndex) || songIndex < 1) {
			return Reply.send(message, { content: "Please provide a valid song number", ephemeral: true });
		}

		if (songIndex >= queue.songs.length) {
			return Reply.send(message, { content: `Song number must be between 1 and ${queue.songs.length - 1}`, ephemeral: true });
		}

		try {
			const removed = queue.songs.splice(songIndex, 1);
			Reply.send(message, { content: `Removed **${removed[0].name}** from the queue!`, ephemeral: true });
		} catch (error) {
			console.error(error);
			Reply.send(message, { content: "An error occurred while removing the song", ephemeral: true });
		}
	},
};
