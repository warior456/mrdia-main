module.exports = {
	name: "finish",
	isCustom: true,
	run: async (client) => {
		client.distube
			.on("finish", (queue) => queue.textChannel.send("Queue ended!"))
	},
};
