module.exports = {
	name: "searchNoResult",
	isCustom: true,
	run: async (client) => {
		client.distube
			.on("searchNoResult", (message, query) => message.channel.send(`No result found for \`${query}\`!`))
	},
};
