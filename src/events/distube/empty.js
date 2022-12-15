module.exports = {
	name: "empty",
	isCustom: true,
	ignore: true, //disabled
	run: async (client) => {
		client.distube
			.on("empty", (channel) => channel.send("Voice channel is empty! Leaving the channel..."))
	},
};
