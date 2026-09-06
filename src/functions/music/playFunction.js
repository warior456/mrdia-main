const Reply = require("../../structures/handlers/replyHandler");
const spotifyUrlInfo = require("spotify-url-info");
const { parse: parseSpotifyUri } = require("spotify-uri");

const spotifyClient = spotifyUrlInfo(globalThis.fetch);

function getSpotifyPlaylistUrl(input) {
	if (typeof input !== "string" || !input.includes("spotify")) return null;
	try {
		const parsed = parseSpotifyUri(input.trim());
		if (parsed.type === "playlist" || parsed.type === "album") {
			return input.trim();
		}
	} catch {}

	const match =
		input.match(/https?:\/\/(?:open\.)?spotify\.com\/(?:[a-zA-Z-]+\/)?(playlist|album)\/[a-zA-Z0-9]+(?:\S+)?/i) ||
		input.match(/spotify:(?:playlist|album):[a-zA-Z0-9]+/i);
	if (match) {
		try {
			const parsed = parseSpotifyUri(match[0]);
			if (parsed.type === "playlist" || parsed.type === "album") {
				return match[0];
			}
		} catch {}
	}

	return null;
}

async function playSpotifyPlaylist(client, message, url, voiceChannel) {
	try {
		await Reply.editReply(message, "Fetching tracks from Spotify...");
		const tracks = await spotifyClient.getTracks(url);

		if (!tracks || tracks.length === 0) {
			return Reply.editReply(message, "Could not find any tracks in this Spotify playlist.");
		}

		await Reply.editReply(
			message,
			`Loaded **${tracks.length}** tracks from Spotify. Adding to queue...`
		);

		// Play first track so queue is established and playback begins
		const firstTrack = tracks[0];
		const firstQuery = `${firstTrack.name} ${firstTrack.artist || ""}`.trim();

		await client.distube.play(voiceChannel, firstQuery, {
			member: message.member,
			textChannel: message.channel,
			metadata: {
				messageObject: message,
				skipVotes: [],
				previousVotes: [],
				ignoremessage: true,
			},
		});

		// Queue remaining tracks sequentially
		for (let i = 1; i < tracks.length; i++) {
			const track = tracks[i];
			const trackQuery = `${track.name} ${track.artist || ""}`.trim();
			try {
				await client.distube.play(voiceChannel, trackQuery, {
					member: message.member,
					textChannel: message.channel,
					metadata: {
						messageObject: message,
						skipVotes: [],
						previousVotes: [],
						ignoremessage: true,
					},
				});
			} catch (err) {
				console.error(`[SpotifyPlaylist] Failed to queue track "${trackQuery}":`, err.message || err);
			}
		}

		Reply.follow(
			message,
			`Finished adding **${tracks.length}** tracks from Spotify to the queue!`
		);
	} catch (error) {
		console.error("[SpotifyPlaylist] Error loading playlist:", error);
		Reply.editReply(message, `Failed to load Spotify playlist: ${error.message || error}`);
	}
}

async function play(client, message, args, voiceChannel) {
	if (Array.isArray(args)) {
		args = args.join(" ");
	}
	const query = (args || "").trim();

	const spotifyPlaylistUrl = getSpotifyPlaylistUrl(query);
	if (spotifyPlaylistUrl) {
		await playSpotifyPlaylist(client, message, spotifyPlaylistUrl, voiceChannel);
	} else {
		await client.distube.play(voiceChannel, query, {
			member: message.member,
			textChannel: message.channel,
			metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: false },
		});
	}

	specials(client, message, voiceChannel);
}

async function specials(client, message, voiceChannel) {
	let max = 5;
	let random = Math.floor(Math.random() * max);

	if (random === 4) {
		const queue = await client.distube.getQueue(message);

		// one if five
		const date = new Date();
		if (date.getMonth() != 11 || (date.getDate() != 25 && date.getDate() != 24)) return console.log("returned back from Christmas special"); //only on this date reason for this order is speed

		await client.distube.play(voiceChannel, "https://www.youtube.com/watch?v=g-OF7KGyDis", {
			member: message.member,
			textChannel: message.channel,
			metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
		});

		if (!queue.songs[2]) {
			await queue.skip();
		}
	}

	if (random === 4 || random === 3 || random === 2) {
		const queue = await client.distube.getQueue(message);
		// one if five
		const date = new Date();
		if (date.getMonth() != 3 || date.getDate() != 1) return console.log("returned back from April fools"); //only on this date reason for this order is speed

		await client.distube.play(voiceChannel, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
			member: message.member,
			textChannel: message.channel,
			metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
		});

		if (!queue.songs[2]) {
			await queue.skip();
		}
	}
}

module.exports = {
	play,
    specials,
};
