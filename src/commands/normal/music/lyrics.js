const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

function splitLyrics(text, maxLength = 3500) {
	if (!text || text.length <= maxLength) return [text || ""];
	const lines = text.split("\n");
	const chunks = [];
	let current = "";

	for (const line of lines) {
		if (line.length > maxLength) {
			if (current.length > 0) {
				chunks.push(current.trim());
				current = "";
			}
			for (let i = 0; i < line.length; i += maxLength) {
				chunks.push(line.slice(i, i + maxLength));
			}
			continue;
		}

		if ((current + "\n" + line).length > maxLength) {
			if (current.length > 0) {
				chunks.push(current.trim());
			}
			current = line;
		} else {
			current = current ? current + "\n" + line : line;
		}
	}

	if (current.trim().length > 0) {
		chunks.push(current.trim());
	}

	return chunks;
}

module.exports = {
	name: "lyrics",
	aliases: [],
	options: [
		{
			name: "name",
			type: ApplicationCommandOptionType.String,
			description: "Give the song name",
			required: false,
		},
		{
			name: "visible",
			type: ApplicationCommandOptionType.Boolean,
			description: "Make the response visible to everyone in the channel (defaults to false)",
			required: false,
		},
	],
	description: "Gives the lyrics to a song",
	category: "music",
	run: async (client, message, args) => {
		const visible = message.options?.getBoolean ? (message.options.getBoolean("visible") ?? false) : false;
		const invisible = !visible;
		await Reply.deferReply(message, invisible);

		let searchQuery;
		if (message.options?.getString) {
			searchQuery = message.options.getString("name");
		} else if (args && args.length > 0) {
			searchQuery = args.join(" ").trim();
		}

		if (!searchQuery) {
			const queue = client.distube.getQueue(message);
			if (queue && queue.songs.length > 0) {
				searchQuery = queue.songs[0].name;
			} else {
				return Reply.editReply(message, "There is no song playing please provide a song to search for");
			}
		}

		try {
			const searches = await LyricsClient.songs.search(searchQuery);
			const firstSong = searches[0];
			if (!firstSong) {
				return Reply.editReply(message, "Couldn't find any lyrics matching your search");
			}

			const lyrics = await firstSong.lyrics();
			if (!lyrics || lyrics.trim().length === 0) {
				return Reply.editReply(message, "Couldn't find any lyrics matching your search");
			}

			const chunks = splitLyrics(lyrics, 3500);

			const embeds = chunks.map((chunk, index) => {
				const embed = new EmbedBuilder()
					.setColor("#FFFF00")
					.setTitle(
						chunks.length > 1
							? `**Lyrics of the Song: (Part ${index + 1}/${chunks.length})**`
							: `**Lyrics of the Song:**`
					)
					.setDescription(chunk);

				if (firstSong.url) {
					embed.setURL(firstSong.url);
				}
				if (index === 0 && firstSong.thumbnail) {
					embed.setThumbnail(firstSong.thumbnail);
				}
				if (chunks.length > 1) {
					embed.setFooter({ text: `Part ${index + 1} of ${chunks.length}` });
				}

				return embed;
			});

			// Group embeds into batches to respect Discord's max 6000 character limit per message
			const batches = [];
			let currentBatch = [];
			let currentBatchChars = 0;

			for (const embed of embeds) {
				const embedLength =
					(embed.data.title?.length || 0) +
					(embed.data.description?.length || 0) +
					(embed.data.footer?.text?.length || 0);

				if (currentBatch.length >= 10 || (currentBatchChars + embedLength > 5000 && currentBatch.length > 0)) {
					batches.push(currentBatch);
					currentBatch = [embed];
					currentBatchChars = embedLength;
				} else {
					currentBatch.push(embed);
					currentBatchChars += embedLength;
				}
			}

			if (currentBatch.length > 0) {
				batches.push(currentBatch);
			}

			Reply.editReply(message, { embeds: batches[0] });

			for (let b = 1; b < batches.length; b++) {
				Reply.follow(message, { embeds: batches[b], ephemeral: invisible });
			}
		} catch (error) {
			console.log(error);
			Reply.editReply(message, "Couldn't find any lyrics matching your search");
		}
	},
};
