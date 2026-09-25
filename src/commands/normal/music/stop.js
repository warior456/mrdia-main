const Reply = require("../../../structures/handlers/replyHandler");

module.exports = {
	name: "stop",
	aliases: ["leave"],
	description: "Stop the queue",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		const botVoiceChannel = message.guild?.members?.me?.voice?.channel;
		const distubeVoice = client.distube.voices.get(message);
		const isInVoice = Boolean(botVoiceChannel || distubeVoice);

		if (!queue && !isInVoice) {
			return Reply.send(message, { content: "There is nothing playing right now!", ephemeral: true });
		}

		const memberVoiceChannel = message.member?.voice?.channel;
		if (botVoiceChannel && memberVoiceChannel && memberVoiceChannel.id !== botVoiceChannel.id && message.member?.user?.id !== client.config.owner) {
			return Reply.send(message, { content: "You must be in the same voice channel as the bot!", ephemeral: true });
		}

		try {
			if (queue) {
				await queue.stop();
			}

			if (distubeVoice) {
				distubeVoice.leave();
			} else if (queue?.voice) {
				queue.voice.leave();
			} else {
				client.distube.voices.leave(message);
			}

			if (message.guild?.members?.me?.voice?.channel) {
				await message.guild.members.me.voice.disconnect().catch(() => {});
			}

			if (queue) {
				Reply.send(message, { content: "Stopped the queue!" });
			} else {
				Reply.send(message, { content: "Left the voice channel!" });
			}
		} catch (error) {
			console.error("Error in stop command:", error);
			Reply.send(message, { content: "An error occurred while stopping!", ephemeral: true });
		}
	},
};

