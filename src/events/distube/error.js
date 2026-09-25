const Reply = require("../../structures/handlers/replyHandler");
module.exports = {
	name: "error",
	isCustom: true,
	run: async (client) => {
		client.distube

			.on("error", (error, queue, song) => {
				const err = error instanceof Error ? error : (queue instanceof Error ? queue : null);
				if (!err) return;
				console.error("[DisTube Error]:", err.message || err);

				const targetQueue = queue && queue.textChannel ? queue : null;
				const targetSong = song || (queue && queue.name ? queue : null);

				if (targetQueue?.textChannel) {
					const songTitle = targetSong?.name ? `**${targetSong.name}**` : "a track";
					const reason = err.message ? ` (${err.message})` : "";
					targetQueue.textChannel.send(`⚠️ Error playing ${songTitle}${reason}. Skipping to next track...`).catch(() => {});
				}
			});
	},
};
