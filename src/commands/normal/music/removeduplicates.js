const Reply = require("../../../structures/handlers/replyHandler");

module.exports = {
	name: "removeduplicates",
	aliases: ["removedupes", "rd"],
	description: "Removes duplicate songs from the queue",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);

		if (!message.member?.voice?.channel && message.member?.user?.id !== client.config.owner) {
			return Reply.send(message, { content: "Join a voice channel first!", ephemeral: true });
		}

		if (!queue || queue.songs.length === 0) {
			return Reply.send(message, { content: "There are no songs in the queue!", ephemeral: true });
		}

		try {
			const uniqueUrls = new Set();
			const initialLength = queue.songs.length;

			// Filter queue songs to keep only unique URLs (first occurrence)
			queue.songs = queue.songs.filter((song) => {
				if (uniqueUrls.has(song.url)) {
					return false; // Remove duplicate
				}
				uniqueUrls.add(song.url);
				return true; // Keep unique
			});

			const removed = initialLength - queue.songs.length;
			const message_content =
				removed === 0
					? "No duplicate songs found in the queue"
					: `Removed **${removed}** duplicate song(s) from the queue`;

			Reply.send(message, { content: message_content, ephemeral: true });
		} catch (error) {
			console.error(error);
			Reply.send(message, { content: "An error occurred while removing duplicates", ephemeral: true });
		}
	},
};
