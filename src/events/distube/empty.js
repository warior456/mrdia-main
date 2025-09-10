const { isVoiceChannelEmpty } = require("distube");

module.exports = {
	name: "empty",
	isCustom: true,
	run: async (client) => {
		client.on("voiceStateUpdate", (oldState, newState) => {
			const queue = client.distube.getQueue(oldState.guild.id);
			if (!queue) return;

			// If the channel became empty
			if (oldState.channel && isVoiceChannelEmpty(oldState)) {
				queue.pause();
			}
			// If someone joined (no longer empty)
			else if (newState.channel && !isVoiceChannelEmpty(newState)) {
				if (queue.paused) queue.resume();
			}
		});
	},
};
